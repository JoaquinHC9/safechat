import * as dotenv from "dotenv";

export default ({ config }) => {
  const env = process.env.APP_ENV || "development";

  try {
    dotenv.config({ path: `.env.${env}` });
  } catch (e) {
    console.log(`No se pudo cargar .env.${env}`, e);
  }

  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL,
      env,
    },
  };
};
