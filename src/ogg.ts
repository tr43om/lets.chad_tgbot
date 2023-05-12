import axios from "axios";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import { removeFile } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ogg = {
  create: async (url: string, filename: string): Promise<string> => {
    try {
      const oggPath = resolve(__dirname, "../voices", `${filename}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });

      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (error: any) {
      console.log(`Error while creating ogg`, error.message);
      throw error;
    }
  },
  toMp3: (input: string, output: string): Promise<string> => {
    try {
      ffmpeg.setFfmpegPath(installer.path);
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", () => {
            removeFile(input);
            resolve(outputPath);
          })
          .on("error", (err) => reject(err.message))
          .run();
      });
    } catch (error: any) {
      console.log(`Error while converting to MP3`, error.message);
      throw error;
    }
  },
};
