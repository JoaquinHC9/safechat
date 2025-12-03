import * as dotenv from "dotenv";
import "dotenv/config";

export default ({ config }) => {
  const env = process.env.APP_ENV || "development";

  // Cargar el archivo .env correspondiente
  dotenv.config({
    path: `.env.${env}`,
  });

  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL,
      env
    }
  };
};
