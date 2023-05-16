import { Telegraf, session } from "telegraf";
import config from "./config.js";
import { message } from "telegraf/filters";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";
import { code } from "telegraf/format";
import { getMainMenu } from "./keyboards.js";
export const bot = new Telegraf(config.telegramBotKey);
bot.use(session());
const INITIAL_SESSION = {
    messages: [],
};
bot.start(async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.replyWithHTML("Приветствую в <b>🗣️ giga.chat</b>\n\n", getMainMenu());
    await ctx.replyWithSticker("CAACAgQAAxkBAANmZF0UULRUjhUT3-7_b9QdkF7OdJMAAsMjAAK18rhTnkVJ87ZCGMkvBA");
});
bot.command("stop", async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply("кончил");
});
bot.on(message("voice"), async (ctx) => {
    var _a;
    (_a = ctx.session) !== null && _a !== void 0 ? _a : (ctx.session = INITIAL_SESSION);
    try {
        await ctx.reply(code("🔃 Принято! Сейчас отвечу..."));
        // console.log(ctx.message);
        await ctx.reply(JSON.stringify(ctx.message));
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        console.log(link.href);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path = await ogg.toMp3(oggPath, userId);
        const prompt = await openai.transcription(mp3Path);
        const { messages } = ctx.session;
        ctx.reply(code(`🗣️ Ваш запрос: ${prompt}`));
        messages.push({ role: "user", content: prompt });
        const response = await openai.chat(messages);
        messages.push({ role: "assistant", content: response.content });
        await ctx.reply(response.content);
    }
    catch (error) {
        console.log(`Error while voice message`, error.message);
    }
});
bot.on(message("text"), async (ctx) => {
    var _a;
    (_a = ctx.session) !== null && _a !== void 0 ? _a : (ctx.session = INITIAL_SESSION);
    try {
        await ctx.reply(code("🔃 Принято! Сейчас отвечу..."));
        const prompt = ctx.message.text;
        const { messages } = ctx.session;
        messages.push({ role: "user", content: prompt });
        const response = await openai.chat(messages);
        messages.push({ role: "assistant", content: response.content });
        await ctx.reply(response.content);
    }
    catch (error) {
        console.log(`Error while voice message`, error.message);
    }
});
if (process.env.NODE_ENV === "development") {
    bot.launch();
}
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
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
