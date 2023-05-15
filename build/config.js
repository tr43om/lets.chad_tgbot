import dotenv from "dotenv";
dotenv.config();
const developmentConfig = {
    telegramBotKey: process.env.TELEGRAM_TOKEN_DEV || "",
    openAIKey: process.env.OPENAI_API_KEY_DEV || "",
};
const productionConfig = {
    telegramBotKey: process.env.TELEGRAM_TOKEN_PROD || "",
    openAIKey: process.env.OPENAI_API_KEY_PROD || "",
};
const config = process.env.NODE_ENV === "production" ? productionConfig : developmentConfig;
export default config;
