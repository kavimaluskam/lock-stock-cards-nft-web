import * as compressImages from "compress-images";
import { DIST_PATH } from "./constants";

// TODO: enhance the compress command
const compress = () => {
  compressImages(
    `${DIST_PATH}/*.gif`,
    `${DIST_PATH}/`,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    {
      gif: { engine: "giflossy", command: ["--lossy=40"] },
    },
    (err: Error, completed: Boolean) => {
      if (err) {
      }
      if (completed === true) {
        // Doing something.
      }
    }
  );
};

compress();
