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
};
