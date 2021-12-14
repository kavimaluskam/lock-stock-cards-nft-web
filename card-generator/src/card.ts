import { createCanvas, Canvas, Image, registerFont } from "canvas";
import { RANK } from "./constants";

export const initFont = () => {
  registerFont("./assets/fonts/card.ttf", { family: RANK.FONT });
};
/**
 * Create a a plain canvas with given dimensions for the card NFT.
 *
 * @param background - The background fill color to be use.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param radius - The corner radius of the canvas.
 *
 * @returns A canvas object as a plain card.
 */
export const createCardBackgroundCanvas = (
  width: number,
  height: number,
  background: string,
  radius: number = 0
): Canvas => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = background;
  ctx.beginPath();
  ctx.moveTo(width, height);
  ctx.arcTo(0, height, 0, 0, radius);
  ctx.arcTo(0, 0, width, 0, radius);
  ctx.arcTo(width, 0, width, height, radius);
  ctx.arcTo(width, height, 0, height, radius);
  ctx.fill();

  return canvas;
};

/**
 * Clone the given canvas to a new and exactly same one,
 * avoiding mutation of the original one.
 *
 * @param canvas - The original canvas.
 *
 * @returns A new and identical canvas.
 */
export const cloneCanvas = (canvas: Canvas): Canvas => {
  const newCanvas = createCanvas(canvas.width, canvas.height);
  const ctx = newCanvas.getContext("2d");
  ctx.drawImage(canvas, 0, 0);
  return newCanvas;
};

/**
 * Drawing canvas image on the 4 corners on a given background canvas,
 * with given image size and paddings.
 *
 * @param background - The background canvas.
 * @param image - The image to be drawn on corners.
 * @param px - The padding of new image on x axis.
 * @param py - The padding of new image on y axis.
 * @param imageWidth - The width of the image to be drawn on background.
 * @param imageHeight - The height of the image to be drawn on background.
 *
 * @returns The background canvas with the image drawn on corners.
 */
export const drawImageOnCanvasCorners = (
  background: Canvas,
  image: Canvas | Image,
  px: number,
  py: number,
  imageWidth: number = image.width,
  imageHeight: number = image.height
): Canvas => {
  // Clone the background canvas to avoid mutation of the original one.
  const newCanvas = cloneCanvas(background);
  const ctx = newCanvas.getContext("2d");

  // Drawing image on the top-right corner
  ctx.drawImage(image, px, py, imageWidth, imageHeight);

  // Drawing image on the top-left corner
  ctx.drawImage(
    image,
    newCanvas.width - px - imageWidth,
    py,
    imageWidth,
    imageHeight
  );

  // Rotate the context 180 degrees & update
  ctx.rotate(Math.PI);
  ctx.translate(-newCanvas.width, -newCanvas.height);

  // Drawing image on the top-right corner (rotated)
  ctx.drawImage(image, px, py, imageWidth, imageHeight);

  // Drawing image on the top-left corner (rotated)
  ctx.drawImage(
    image,
    newCanvas.width - px - imageWidth,
    py,
    imageWidth,
    imageHeight
  );

  return newCanvas;
};

export const drawTextOnCanvasCorner = (
  background: Canvas,
  text: string,
  fontSize: number,
  fontFamily: string,
  fontColor: string,
  pl: number,
  pr: number,
  py: number
): Canvas => {
  // Clone the background canvas to avoid mutation of the original one.
  const newCanvas = cloneCanvas(background);
  const ctx = newCanvas.getContext("2d");

  // Set font
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;

  // Draw text on the top-right corner
  ctx.fillText(text, pl, py);

  // Draw text on the top-left corner
  ctx.fillText(text, pr, py);

  // Rotate the context 180 degrees & update
  ctx.rotate(Math.PI);
  ctx.translate(-newCanvas.width, -newCanvas.height);

  // Draw text on the top-right corner (rotated)
  ctx.fillText(text, pl, py);

  // Draw text on the top-left corner (rotated)
  ctx.fillText(text, pr, py);

  return newCanvas;
};

export const drawImageOnCanvasCenter = (
  background: Canvas,
  image: Canvas | Image,
  px: number,
  py: number,
  imageWidth: number = image.width,
  imageHeight: number = image.height
) => {
  // Clone the background canvas to avoid mutation of the original one.
  const newCanvas = cloneCanvas(background);
  const ctx = newCanvas.getContext("2d");

  // Drawing image on the top-right corner
  ctx.drawImage(image, px, py, imageWidth, imageHeight);

  // Rotate the context 180 degrees & update
  ctx.rotate(Math.PI);
  ctx.translate(-newCanvas.width, -newCanvas.height);

  // Drawing image on the top-right corner (rotated)
  ctx.drawImage(image, px, py, imageWidth, imageHeight);

  return newCanvas;
};
