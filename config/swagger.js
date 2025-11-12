const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lambda URL Extractor API',
      version: '1.0.0',
      description: 'A comprehensive API for URL extraction, user management, and authentication services',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        },
        googleOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                'openid': 'OpenID Connect',
                'profile': 'Access to user profile',
                'email': 'Access to user email'
              }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique user identifier',
              example: '60f7b3b3b3b3b3b3b3b3b3b3'
            },
            fullName: {
              type: 'string',
              description: 'User\'s full name',
              minLength: 2,
              maxLength: 50,
              pattern: '^[a-zA-Z\\s]+$',
              example: 'John Doe'
            },
            identifier: {
              type: 'string',
              description: 'Email address or phone number (unique)',
              example: 'user@example.com'
            },
            identifierType: {
              type: 'string',
              enum: ['email', 'phone'],
              description: 'Type of identifier used',
              example: 'email'
            },
            ageGroup: {
              type: 'string',
              enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Not specified'],
              description: 'User\'s age group',
              example: '25-34'
            },
            googleId: {
              type: 'string',
              description: 'Google account ID (if linked)',
              example: '1234567890123456789'
            },
            avatar: {
              type: 'string',
              format: 'uri',
              description: 'URL to user\'s profile picture',
              example: 'https://example.com/avatar.jpg'
            },
            identifierVerified: {
              type: 'boolean',
              description: 'Whether the identifier (email/phone) is verified',
              example: true
            },
            registrationStep: {
              type: 'string',
              enum: ['pending_verification', 'completed'],
              description: 'Current registration step',
              example: 'completed'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp',
              example: '2023-12-01T10:30:00.000Z'
            },
            LastActive: {
              type: 'string',
              format: 'date-time',
              description: 'Last activity timestamp',
              example: '2023-12-01T15:45:00.000Z'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2023-11-01T08:00:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2023-12-01T10:30:00.000Z'
            }
          },
          required: ['fullName', 'identifier', 'identifierType', 'ageGroup']
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
              example: true
            },
            message: {
              type: 'string',
              description: 'Human-readable message describing the result',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data (structure varies by endpoint)',
              additionalProperties: true
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
              example: '2023-12-01T10:30:00.000Z'
            }
          },
          required: ['success', 'message']
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Always false for error responses',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              description: 'Detailed error information',
              example: 'Validation failed: Email is required'
            },
            code: {
              type: 'string',
              description: 'Error code for programmatic handling',
              example: 'VALIDATION_ERROR'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
              example: '2023-12-01T10:30:00.000Z'
            }
          },
          required: ['success', 'message']
        },
        LambdaRequest: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'uri',
              description: 'Target URL to make the request to',
              example: 'https://api.example.com/data'
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
              description: 'HTTP method',
              example: 'GET'
            },
            headers: {
              type: 'object',
              description: 'HTTP headers as key-value pairs',
              additionalProperties: {
                type: 'string'
              },
              example: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token123'
              }
            },
            data: {
              type: 'object',
              description: 'Request body data',
              additionalProperties: true,
              example: {
                'key': 'value',
                'nested': {
                  'property': 'data'
                }
              }
            },
            timeout: {
              type: 'integer',
              description: 'Request timeout in milliseconds',
              minimum: 1000,
              maximum: 30000,
              default: 10000,
              example: 5000
            },
            retries: {
              type: 'integer',
              description: 'Number of retry attempts',
              minimum: 0,
              maximum: 5,
              default: 3,
              example: 2
            }
          },
          required: ['url', 'method']
        },
        LambdaResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer',
                  description: 'HTTP status code',
                  example: 200
                },
                headers: {
                  type: 'object',
                  description: 'Response headers',
                  additionalProperties: {
                    type: 'string'
                  },
                  example: {
                    'content-type': 'application/json',
                    'content-length': '1234'
                  }
                },
                data: {
                  description: 'Response body data',
                  oneOf: [
                    { type: 'object' },
                    { type: 'array' },
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'boolean' }
                  ],
                  example: {
                    'result': 'success',
                    'items': ['item1', 'item2']
                  }
                },
                responseTime: {
                  type: 'number',
                  description: 'Response time in milliseconds',
                  example: 245.67
                },
                requestId: {
                  type: 'string',
                  description: 'Unique request identifier',
                  example: 'req_1234567890abcdef'
                }
              }
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Request executed successfully'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
              example: '2023-12-01T10:30:00.000Z'
            }
          },
          required: ['success', 'data', 'message']
        },
        OTPRequest: {
          type: 'object',
          properties: {
            identifier: {
              type: 'string',
              description: 'Email address or phone number',
              example: 'user@example.com'
            },
            otp: {
              type: 'string',
              description: 'One-time password (6 digits)',
              pattern: '^[0-9]{6}$',
              example: '123456'
            }
          },
          required: ['identifier', 'otp']
        },
        RegistrationRequest: {
          type: 'object',
          properties: {
            identifier: {
              type: 'string',
              description: 'Email address or phone number',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              minLength: 6,
              example: 'password123'
            },
            fullName: {
              type: 'string',
              description: 'User\'s full name',
              minLength: 2,
              maxLength: 50,
              example: 'John Doe'
            },
            ageGroup: {
              type: 'string',
              enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Not specified'],
              description: 'User\'s age group',
              example: '25-34'
            }
          },
          required: ['identifier', 'password', 'fullName', 'ageGroup']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            identifier: {
              type: 'string',
              description: 'Email address or phone number',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'password123'
            }
          },
          required: ['identifier', 'password']
        },
        GoogleTokenRequest: {
          type: 'object',
          properties: {
            idToken: {
              type: 'string',
              description: 'Google ID token from client-side authentication',
              example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...'
            }
          },
          required: ['idToken']
        },
        PasswordChangeRequest: {
          type: 'object',
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Current password',
              example: 'oldpassword123'
            },
            newPassword: {
              type: 'string',
              description: 'New password',
              minLength: 6,
              example: 'newpassword123'
            },
            confirmPassword: {
              type: 'string',
              description: 'Confirm new password',
              example: 'newpassword123'
            }
          },
          required: ['currentPassword', 'newPassword']
        },
        PasswordResetRequest: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Password reset token',
              example: 'abc123def456'
            },
            newPassword: {
              type: 'string',
              description: 'New password',
              minLength: 6,
              example: 'newpassword123'
            }
          },
          required: ['token', 'newPassword']
        },
        UserStatusUpdate: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'New user status',
              example: 'suspended'
            },
            reason: {
              type: 'string',
              description: 'Reason for status change',
              example: 'Violation of terms of service'
            }
          },
          required: ['status']
        },
        PaginationInfo: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              description: 'Current page number',
              example: 1
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
              example: 5
            },
            totalUsers: {
              type: 'integer',
              description: 'Total number of users',
              example: 50
            },
            hasNext: {
              type: 'boolean',
              description: 'Whether there is a next page',
              example: true
            },
            hasPrev: {
              type: 'boolean',
              description: 'Whether there is a previous page',
              example: false
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
              example: 10
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Lambda API',
        description: 'HTTP request execution endpoints'
      },
      {
        name: 'Authentication',
        description: 'User authentication and registration'
      },
      {
        name: 'Google OAuth',
        description: 'Google OAuth integration'
      },
      {
        name: 'User Management',
        description: 'User profile and account management'
      },
      {
        name: 'User Management - Admin',
        description: 'Administrative user management functions'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .scheme-container { background: #fafafa; padding: 30px 0 }
  `,
  customSiteTitle: 'Lambda URL Extractor API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions
};