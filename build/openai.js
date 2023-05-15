import { OpenAIApi, Configuration, } from "openai";
import { createReadStream } from "fs";
import config from "./config.js";
class OpenAI {
    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }
    async chat(messages) {
        try {
            const response = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
            });
            if (!response.data.choices[0].message)
                throw new Error("Error while generating answer from ChatGPT");
            return response.data.choices[0].message;
        }
        catch (error) {
            console.log(`Error while gpt chat`, error.message);
            throw error;
        }
    }
    async transcription(filepath) {
        try {
            const response = await this.openai.createTranscription(createReadStream(filepath), "whisper-1");
            return response.data.text;
        }
        catch (error) {
            console.log(`Error while transcription`, error.message);
            throw error;
        }
    }
}
export const openai = new OpenAI(config.openAIKey);
