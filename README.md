# Chat App Backend

RESTful и WebSocket API для приложения-мессенджера реального времени. Серверная часть обеспечивает аутентификацию пользователей, управление профилями, обмен сообщениями через WebSocket и отправку уведомлений по электронной почте.

## Возможности

- Аутентификация и регистрация с JWT токенами и refresh tokens.
- Безопасное хеширование паролей с использованием bcrypt.
- Real-time коммуникация через WebSocket (Socket.io).
- RESTful API для управления пользователями и профилями.
- Двухуровневая система ролей (USER, ADMIN).
- Отслеживание статуса пользователя (ONLINE, OFFLINE).
- SMTP интеграция для отправки уведомлений по email.
- Кэширование данных с помощью Redis.
- Документация API через Swagger/OpenAPI.
- Валидация данных с помощью class-validator и class-transformer.
- Миграции БД через Prisma Migration.
- Полное покрытие тестами (unit и e2e).

## Стек

- NestJS 11
- TypeScript 5
- PostgreSQL (с Prisma ORM)
- Socket.io (WebSocket)
- JWT (access и refresh tokens)
- Redis (ioredis)
- Nodemailer (SMTP)
- Swagger/OpenAPI
- Jest
- Passport.js
- bcrypt

## Запуск проекта

В проекте используется `npm` или `yarn`. Убедитесь, что у вас установлены Node.js (v18+) и PostgreSQL.

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/your-username/chat-app-backend.git
cd chat-app-backend
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Создайте файл `.env` в корне проекта

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chat_app_db"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@chatapp.com

# Server
PORT=3000
NODE_ENV=development
```

### 4. Выполните миграции БД

```bash
npm run migrate:dev
```

или если нужно сбросить БД (только для разработки):

```bash
npm run migrate:reset
```

### 5. Запустите сервер

```bash
# Режим разработки с горячей перезагрузкой
npm run start:dev

# Или продакшн режим
npm run start:prod
```

Сервер будет доступен по адресу `http://localhost:3000/`.
WebSocket подключение: `ws://localhost:3000/`.
Документация API доступна по адресу `http://localhost:3000/api/`.

## Структура проекта

- `src/app` - главный модуль приложения (AppModule, контроллер).
- `src/auth` - модуль аутентификации (логин, регистрация, стратегии Passport).
- `src/users` - модуль управления пользователями (CRUD, профиль).
- `src/chat` - модуль WebSocket для обмена сообщениями в реальном времени.
- `src/token` - сервис управления JWT токенами.
- `src/prisma` - интеграция с Prisma ORM и миграции.
- `src/smtp` - сервис отправки писем по SMTP.
- `src/shared` - общие типы, интерфейсы, утилиты и энумы.
- `prisma/` - схема БД и миграции.
- `test/` - e2e и unit тесты.

## Скрипты

```bash
# Развитие
npm run start:dev      # Запуск в режиме watch
npm run start:debug    # Отладка с инспектором

# Сборка и продакшн
npm run build          # Компиляция TypeScript
npm run start:prod     # Запуск скомпилированного приложения

# Тестирование
npm run test           # Unit тесты
npm run test:watch    # Unit тесты в режиме watch
npm run test:cov      # Тесты с отчетом о покрытии
npm run test:e2e      # End-to-end тесты

# Код качество
npm run format         # Форматирование кода с Prettier
npm run lint           # Проверка и исправление с ESLint

# БД
npm run migrate:dev    # Создать и применить миграцию
npm run migrate:reset  # Сбросить БД (разработка)
npm run studio         # Открыть Prisma Studio для визуального редактирования
```

## API Endpoints

### Authentication

- `POST /auth/register` - Регистрация нового пользователя
- `POST /auth/login` - Вход в систему
- `POST /auth/refresh` - Обновление access token через refresh token

### Users

- `GET /users` - Получить список всех пользователей (ADMIN only)
- `GET /users/:id` - Получить информацию о пользователе
- `PATCH /users/:id/username` - Обновить имя пользователя
- `PATCH /users/:id/password` - Изменить пароль
- `PATCH /users/:id/email` - Обновить email
- `DELETE /users/:id` - Удалить аккаунт пользователя

### Chat (WebSocket)

- `ws://localhost:3000/` - Подключение для обмена сообщениями в реальном времени

## Безопасность

- Пароли хешируются с помощью bcrypt перед сохранением в БД.
- JWT токены используются для аутентификации (access + refresh tokens).
- Реализованы guards для защиты защищённых роут (JwtAuthGuard, RolesGuard).
- HTTPS рекомендуется использовать в продакшене.
- CORS настраивается в зависимости от фронтенд приложения.
  $ npm run test

# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
