import { exportGifFromCanvasFrames, importGifToCanvasFrames } from "../src/gif";
import { createCardBackgroundCanvas } from "../src/card2";

describe("exportGifFromCanvasFrames & importGifToCanvasFrames", () => {
  it("gif and canvas frames should be transform by the export / import pair function", async () => {
    const frames = ["#FFF", "#000", "#FFF", "#000"].map((color) =>
      createCardBackgroundCanvas(50, 50, color)
    );

    await exportGifFromCanvasFrames("/tmp/test.gif", frames);

    // Since I don't know how to mock the input stream and test it,
    // I will just read the gif to frames and compare them.
    setTimeout(() => {}, 2000);
    const newFrames = await importGifToCanvasFrames("/tmp/test.gif");

    expect(newFrames.length).toBe(frames.length);
    expect(newFrames.map((frame) => frame.width)).toEqual(
      frames.map((frame) => frame.width)
    );
    expect(newFrames.map((frame) => frame.height)).toEqual(
      frames.map((frame) => frame.height)
    );
    expect(
      newFrames.map((frame) =>
        frame.getContext("2d").getImageData(20, 20, 1, 1).data.toString()
      )
    ).toEqual(
      frames.map((frame) =>
        frame.getContext("2d").getImageData(20, 20, 1, 1).data.toString()
      )
    );
  });
});
