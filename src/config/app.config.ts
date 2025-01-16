import { configDotenv } from 'dotenv';

// Load ENVs only on development environment
if (process.env.NODE_ENV !== 'production') configDotenv();

const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,
  server: {
    port: process.env.PORT,
    baseURL: process.env.BASE_URL
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'task',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  },
  jwt: {
    ACCESS_TOKEN_EXPIRY: String(process.env.ACCESS_TOKEN_EXPIRY),
    REFRESH_TOKEN_EXPIRY: String(process.env.REFRESH_TOKEN_EXPIRY),
    ACCESS_TOKEN_SECRET: String(process.env.ACCESS_TOKEN_SECRET),
    REFRESH_TOKEN_SECRET: String(process.env.REFRESH_TOKEN_SECRET)
  },
  TTL: {
    EMAIL_DURATION: Number(process.env.EMAIL_DURATION),
    PASSWORD_DURATION: Number(process.env.PASSWORD_DURATION),
    MFA_DURATION: Number(process.env.MFA_DURATION)
  },
  GOOGLE: {
    SESSION_SECRET: String(process.env.SESSION_SECRET),
    GOOGLE_CLIENT_ID: String(process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: String(process.env.GOOGLE_CLIENT_SECRET)
  },
  sendEmail: {
    email:
      process.env.NODE_ENV === 'development'
        ? String(process.env.AUTH_PRODUCTION_EMAIL)
        : String(process.env.AUTH_DEVELOPMENT_EMAIL),
    BREVO_PASSWORD: String(process.env.BREVO_PASSWORD),
    BREVO_USERNAME: String(process.env.BREVO_USERNAME),

    EMAIL_HOST: String(process.env.EMAIL_HOST),
    EMAIL_PORT: String(process.env.EMAIL_PORT),
    redirectUri: String(process.env.EMAIL_REDIRECT_URI),

    EMAIL_USERNAME: String(process.env.EMAIL_USERNAME),

    EMAIL_PASSWORD: String(process.env.EMAIL_PASSWORD),

    smtpServer: String(process.env.SMTP_SERVER || 'smtp-relay.brevo.com'),
    smtpPort: Number(process.env.SMTP_PORT || 2525)
  }
};

export default AppConfig;
