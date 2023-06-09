import { Markup, Telegraf, session } from "telegraf";

import { message } from "telegraf/filters";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";
import { ChatCompletionRequestMessage } from "openai";
import { code } from "telegraf/format";

import { getMainMenu } from "./keyboards.js";
import { bot } from "./bot-webhook.js";
import axios from "axios";

bot.use(session());

const INITIAL_SESSION = {
  messages: [] as ChatCompletionRequestMessage[],
};
bot.start(async (ctx) => {
  ctx.session = INITIAL_SESSION;

  await ctx.replyWithHTML(
    "Приветствую в <b>🗣️ giga.chat</b>\n\n",
    getMainMenu()
  );
  await ctx.replyWithSticker(
    "CAACAgQAAxkBAANmZF0UULRUjhUT3-7_b9QdkF7OdJMAAsMjAAK18rhTnkVJ87ZCGMkvBA"
  );
});

bot.command("stop", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("кончил");
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  try {
    await ctx.reply(code("🔃 Принято! Сейчас отвечу..."));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    console.log(link.href);

    const fileId = ctx.message.voice.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

    const response = await axios(url, { responseType: "arraybuffer" });
    const oggBuffer = Buffer.from(response.data);
    // const oggPath = await ogg.create(link.href, userId);
    // const mp3Path = await ogg.toMp3(oggPath, userId);

    // const prompt = await openai.transcription(mp3Path);
    // const { messages } = ctx.session;

    // ctx.reply(code(`🗣️ Ваш запрос: ${prompt}`));

    // messages.push({ role: "user", content: prompt });
    // const response = await openai.chat(messages);
    // messages.push({ role: "assistant", content: response.content });

    // await ctx.reply(response.content);
  } catch (error: any) {
    console.log(`Error while voice message`, error.message);
  }
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  try {
    await ctx.reply(code("🔃 Принято! Сейчас отвечу..."));

    const prompt = ctx.message.text;
    const { messages } = ctx.session;

    messages.push({ role: "user", content: prompt });
    const response = await openai.chat(messages);
    messages.push({ role: "assistant", content: response.content });

    await ctx.reply(response.content);
  } catch (error: any) {
    console.log(`Error while voice message`, error.message);
  }
});

if (process.env.NODE_ENV === "development") {
  bot.launch();
}
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
