import { UserDTO } from 'src/users/dto';

export const API_RESPONSES = {
  USER_CREATED: {
    status: 200,
    description: 'User created',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User created',
        },
      },
    },
  },
  USER_CONFLICT: {
    status: 409,
    description: 'User already exists',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User already exists',
        },
        error: {
          type: 'string',
          example: 'Conflict',
        },
        statusCode: {
          type: 'number',
          example: 409,
        },
      },
    },
  },
  USERS_TOKEN: {
    status: 200,
    description: 'Users token',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'example_token',
        },
        refresh_token: {
          type: 'string',
          example: 'example_refresh_token',
        },
      },
    },
  },
  INVALID_CREDENTIALS: {
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid credentials',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  },
  TOKEN_REFRESHED: {
    status: 200,
    description: 'Token refreshed',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'example_token',
        },
      },
    },
  },
  INVALID_REFRESH_TOKEN: {
    status: 401,
    description: 'Invalid refresh token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid refresh token',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  },
  LOGOUT_SUCCESS: {
    status: 200,
    description: 'Logout success',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout success',
        },
      },
    },
  },
  TOKEN_BLACKLISTED: {
    status: 401,
    description: 'Token is blacklisted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token is blacklisteds',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
  },
  CURRENT_USER: {
    status: 200,
    description: 'Get information about the current user',
    type: UserDTO,
  },
  USER_NOT_FOUND: {
    status: 409,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User not found',
        },
        error: {
          type: 'string',
          example: 'Conflict',
        },
        statusCode: {
          type: 'number',
          example: 409,
        },
      },
    },
  },
  USER_FOUND: {
    status: 200,
    description: 'User found',
    type: UserDTO,
  },
  USER_DELETED: {
    status: 200,
    description: 'User deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted',
        },
      },
    },
  },
  PASSWORD_UPDATED: {
    status: 200,
    description: 'Password updated',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password updated',
        },
      },
    },
  },
  USERNAME_UPDATED: {
    status: 200,
    description: 'Username updated',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Username updated',
        },
        accessToken: {
          type: 'string',
          example: 'example_token',
        },
      },
    },
  },
  EMAIL_UPDATED: {
    status: 200,
    description: 'Email updated',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Email updated',
        },
      },
    },
  },
};
