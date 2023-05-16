import { Telegraf } from "telegraf";
import config from "./config.js";
export const bot = new Telegraf(config.telegramBotKey);
bot.on("message", async (ctx) => {
    await ctx.reply("Hi there!");
});
if (process.env.NODE_ENV === "production") {
    bot.telegram.setWebhook(`${process.env.VERCEL_URL}/api/bot-webhook`);
}
export default async (req, res) => {
    if (req.method === "POST") {
        try {
            await bot.handleUpdate(req.body, res);
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        res.status(200).send("Hello");
    }
};
