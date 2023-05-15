import dotenv from "dotenv";

dotenv.config();

interface Config {
  openAIKey: string;
  telegramBotKey: string;
}

const developmentConfig: Config = {
  telegramBotKey: process.env.TELEGRAM_TOKEN_DEV || "",
  openAIKey: process.env.OPENAI_API_KEY_DEV || "",
};

const productionConfig: Config = {
  telegramBotKey: process.env.TELEGRAM_TOKEN_PROD || "",
  openAIKey: process.env.OPENAI_API_KEY_PROD || "",
};

const config =
  process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;

export default config;
