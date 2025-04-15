import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SmtpService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordChanged(email: string, username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Изменение пароля в вашем аккаунте Chat',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>Здравствуйте, ${username}!</h2>
          <p>
            Мы уведомляем вас, что пароль для вашего аккаунта в сервисе <b>Chat</b> был успешно изменён.<br>
            Если вы лично инициировали это изменение — никаких дополнительных действий не требуется.<br>
            Если вы не совершали это действие, пожалуйста, немедленно свяжитесь с нашей службой поддержки для обеспечения безопасности вашего аккаунта.
          </p>
          <p style="color: #888; font-size: 14px;">
            С уважением,<br>
            команда поддержки Chat
          </p>
        </div>
      `,
    });
  }

  async sendEmailChanged(email: string, username: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Изменение адреса электронной почты в вашем аккаунте Chat',
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>Здравствуйте, ${username}!</h2>
          <p>
            Мы уведомляем вас, что адрес электронной почты, привязанный к вашему аккаунту в сервисе <b>Chat</b>, был успешно изменён.<br>
            Если вы инициировали это изменение — никаких дополнительных действий не требуется.<br>
            Если вы не совершали это действие, пожалуйста, немедленно свяжитесь с нашей службой поддержки для обеспечения безопасности вашего аккаунта.
          </p>
          <p style="color: #888; font-size: 14px;">
            С уважением,<br>
            команда поддержки Chat
          </p>
        </div>
      `,
    });
  }
}
