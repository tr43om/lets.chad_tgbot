import { VercelRequest, VercelResponse } from "@vercel/node";
import { bot } from "../src/index.js";

if (process.env.NODE_ENV === "production") {
  bot.telegram.setWebhook(`${process.env.VERCEL_URL}/src/bot`);
} else {
  bot.launch();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body, res);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.status(200).send("Hello");
  }
};
