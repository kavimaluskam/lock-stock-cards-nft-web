import { createCanvas, Canvas, createImageData } from "canvas";
import * as GIFEncoder from "gifencoder";
import * as getPixels from "get-pixels";
import * as fs from "fs";
import * as savePixels from "save-pixels";

export const exportGifFromCanvasFrames = (
  outputFilePath: string,
  frames: Canvas[],
  delay: number = 500,
  quality: number = 10,
  repeat: boolean = true
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (new Set(frames.map((f) => `${f.width},${f.height}`)).size > 1) {
      reject(new Error("All frames must be the same size"));
    }

    const encoder = new GIFEncoder(frames[0].width, frames[0].height);
    encoder.createReadStream().pipe(fs.createWriteStream(outputFilePath));

    encoder.start();
    encoder.setDelay(delay);
    encoder.setQuality(quality);
    if (repeat) {
      encoder.setRepeat(0);
    }

    for (const frame of frames) {
      const ctx = frame.getContext("2d");
      encoder.addFrame(ctx);
    }

    encoder.finish();

    resolve();
  });
};

export const importGifToCanvasFrames = async (
  inputFilePath: string
): Promise<Canvas[]> => {
  return new Promise((resolve, reject) => {
    getPixels(inputFilePath, "image/gif", (err: any, pixels) => {
      if (err) {
        reject(err);
      }

      if (pixels.shape.length < 4) {
        reject(new Error("GIF must have at least one frame"));
      }

      const result = Array(pixels.shape[0])
        .fill(0)
        .map(async (_, i) => {
          const canvas = createCanvas(pixels.shape[1], pixels.shape[2]);
          const ctx = canvas.getContext("2d");

          const size = pixels.shape[1] * pixels.shape[2] * 4;
          const array = new Uint8ClampedArray(
            pixels.data.slice(i * size, (i + 1) * size)
          );

          ctx.putImageData(
            createImageData(array, pixels.shape[1], pixels.shape[2]),
            0,
            0
          );
          return canvas;
        });

      resolve(Promise.all(result));
    });
  });
};
