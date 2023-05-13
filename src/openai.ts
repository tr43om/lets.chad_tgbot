import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from "openai";
import config from "config";
import { PathLike, createReadStream } from "fs";
class OpenAI {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(
    messages: ChatCompletionRequestMessage[]
  ): Promise<ChatCompletionResponseMessage> {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      if (!response.data.choices[0].message)
        throw new Error("Error while generating answer from ChatGPT");

      return response.data.choices[0].message;
    } catch (error: any) {
      console.log(`Error while gpt chat`, error.message);
      throw error;
    }
  }

  async transcription(filepath: PathLike): Promise<string> {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filepath) as unknown as File,
        "whisper-1"
      );

      return response.data.text;
    } catch (error: any) {
      console.log(`Error while transcription`, error.message);
      throw error;
    }
  }
}

export const openai = new OpenAI(process.env.OPENAI_API_KEY as string);
