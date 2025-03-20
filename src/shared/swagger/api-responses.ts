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
};
