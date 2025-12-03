import 'dotenv/config';

const env = process.env.APP_ENV || 'development';

export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.API_URL,
    env: env,
    eas: {
      projectId: config.extra?.eas?.projectId // Si usas EAS
    }
  },
});