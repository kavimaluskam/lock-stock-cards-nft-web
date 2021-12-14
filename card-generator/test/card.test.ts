import {
  cloneCanvas,
  createCardBackgroundCanvas,
  drawImageOnCanvasCorners,
} from "../src/card";

const WHITE_PIXEL_BYTE_STRING = "255,255,255,255";
const EMPTY_PIXEL_BYTE_STRING = "0,0,0,0";
const BLACK_PIXEL_BYTE_STRING = "0,0,0,255";

describe("create card background canvas", () => {
  it("should return a canvas with correct size and color", () => {
    const width = 100;
    const height = 200;
    const canvas = createCardBackgroundCanvas(width, height, "#ffffff");

    expect(canvas.width).toBe(width);
    expect(canvas.height).toBe(height);
    expect(canvas.type).toBe("image");

    // Testing the border radius
    expect(
      canvas.getContext("2d").getImageData(0, 0, 1, 1).data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
    expect(
      canvas
        .getContext("2d")
        .getImageData(width / 2, height / 2, 1, 1)
        .data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
    expect(
      canvas
        .getContext("2d")
        .getImageData(width - 1, height - 1, 1, 1)
        .data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
  });

  it("should return a canvas with correct size, color and border radius", () => {
    const width = 100;
    const height = 200;
    const canvas = createCardBackgroundCanvas(width, height, "#ffffff", 20);

    expect(canvas.width).toBe(width);
    expect(canvas.height).toBe(height);
    expect(canvas.type).toBe("image");

    // Testing the border radius
    expect(
      canvas.getContext("2d").getImageData(0, 0, 1, 1).data.toString()
    ).toBe(EMPTY_PIXEL_BYTE_STRING);
    expect(
      canvas
        .getContext("2d")
        .getImageData(width / 2, height / 2, 1, 1)
        .data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
    expect(
      canvas
        .getContext("2d")
        .getImageData(width - 1, height - 1, 1, 1)
        .data.toString()
    ).toBe(EMPTY_PIXEL_BYTE_STRING);
  });
});

describe("cloning a canvas", () => {
  it("should return an exactly same canvas with different reference", () => {
    const canvas = createCardBackgroundCanvas(100, 200, "#ffffff");
    const clone = cloneCanvas(canvas);

    expect(canvas).not.toBe(clone);
    expect(canvas.width).toBe(clone.width);
    expect(canvas.height).toBe(clone.height);
    expect(canvas.type).toBe(clone.type);
    expect(canvas.getContext("2d").getImageData(0, 0, 100, 200).data).toEqual(
      clone.getContext("2d").getImageData(0, 0, 100, 200).data
    );
  });
});

describe("drawing images on canvas corner", () => {
  it("should new a new canvas as background canvas with 4 corners drawn", () => {
    const padding_x = 10;
    const padding_y = 10;

    const background = createCardBackgroundCanvas(100, 100, "#ffffff");
    const image = createCardBackgroundCanvas(20, 20, "#000");

    const newCanvas = drawImageOnCanvasCorners(
      background,
      image,
      padding_x,
      padding_y
    );

    expect(newCanvas.width).toBe(background.width);
    expect(newCanvas.height).toBe(background.height);
    expect(newCanvas.type).toBe(background.type);

    // Testing the border radius
    expect(
      newCanvas.getContext("2d").getImageData(0, 0, 1, 1).data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
    expect(
      newCanvas
        .getContext("2d")
        .getImageData(padding_x, padding_y, 1, 1)
        .data.toString()
    ).toBe(BLACK_PIXEL_BYTE_STRING);
    expect(
      newCanvas
        .getContext("2d")
        .getImageData(background.width / 2, background.height / 2, 1, 1)
        .data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
    expect(
      newCanvas
        .getContext("2d")
        .getImageData(
          background.width - padding_x - 1,
          background.height - padding_y - 1,
          1,
          1
        )
        .data.toString()
    ).toBe(BLACK_PIXEL_BYTE_STRING);
    expect(
      newCanvas
        .getContext("2d")
        .getImageData(background.width - 1, background.height - 1, 1, 1)
        .data.toString()
    ).toBe(WHITE_PIXEL_BYTE_STRING);
  });
});

// TODO
// describe("writing text on canvas corner", () => {
//   it("should new a new canvas as background canvas with 4 corners written", () => {});
// });
