require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const { apiLimiter } = require('./middlewares/rateLimiter');
const initScraperCron = require('./cron/scraperCron');

const app = express();

// ----- Security & core middleware -----
app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiLimiter);

// Static resume/avatar uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----- API docs -----
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----- Routes -----
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Job Portal API is running', docs: '/api-docs' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
  initScraperCron();
};

// In test mode, the test file connects to an in-memory Mongo instance and
// uses supertest against the exported app directly (no listening socket
// or cron job needed).
if (process.env.NODE_ENV !== 'test') {
  start();
}

module.exports = app; // exported for tests (supertest)
