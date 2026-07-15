const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI-Ready Job Portal API',
      version: '1.0.0',
      description:
        'REST API for the Job Portal platform - authentication, jobs, applications, companies, dashboards and the job scraper.',
    },
    servers: [
      { url: '/api', description: 'Current server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
