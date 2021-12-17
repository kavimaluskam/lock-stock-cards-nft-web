import { loadImage } from "canvas";
import {
  createCardBackgroundCanvas,
  drawImageOnCanvasCorners,
  drawTextOnCanvasCorner,
  drawMirroredImageOnCanvasCenter,
} from "./card";
import { importGifToCanvasFrames, exportGifFromCanvasFrames } from "./gif";
import { Suit, Rank, Character } from "./type";
import {
  CARD,
  SUIT,
  RANK,
  CHARACTER,
  COLLECTION,
  LAYER_SOURCE_PATH,
  DIST_PATH,
  WALLET_ADDRESS,
} from "./constants";
import * as fs from "fs";

export const draw = async (
  characterKey: string,
  suitKey: string,
  rankKey: string,
  index: number
): Promise<void> => {
  const card = createCardBackgroundCanvas(
    CARD.WIDTH,
    CARD.HEIGHT,
    CARD.BACKGROUND,
    CARD.RADIUS
  );

  const suitImage = await loadImage(
    `${LAYER_SOURCE_PATH}/suits/${suitKey}.png`
  );
  const cardWithSuit = drawImageOnCanvasCorners(
    card,
    suitImage,
    SUIT.PX,
    SUIT.PY,
    SUIT.SIZE,
    SUIT.SIZE
  );

  const rankColor =
    [Suit.Spades, Suit.Clubs].indexOf(Suit[suitKey]) > -1
      ? RANK.FONT_BLACK
      : RANK.FONT_RED;
  const cardWithSuitAndRank = drawTextOnCanvasCorner(
    cardWithSuit,
    Rank[rankKey],
    RANK.FONT_SIZE,
    RANK.FONT,
    rankColor,
    Rank[rankKey] === Rank.Ten ? RANK.PL + RANK.TEN_PX_ADJUSTMENT : RANK.PL,
    Rank[rankKey] === Rank.Ten ? RANK.PR + RANK.TEN_PX_ADJUSTMENT : RANK.PR,
    RANK.PY
  );

  const characterFrames = await importGifToCanvasFrames(
    `${LAYER_SOURCE_PATH}/characters/${characterKey}.gif`
  );

  const cardFrames = characterFrames
    .filter((_, k) => k % 4)
    .map((frame) =>
      drawMirroredImageOnCanvasCenter(
        cardWithSuitAndRank,
        frame,
        CHARACTER.PX,
        CHARACTER.PY,
        CHARACTER.WIDTH,
        CHARACTER.HEIGHT
      )
    );

  await exportGifFromCanvasFrames(`${DIST_PATH}/${index}.gif`, cardFrames, 50);
};

export const writeMetadata = async (
  characterKey: string,
  suitKey: string,
  rankKey: string,
  index: number
): Promise<void> => {
  const metadata = {
    name: `${Character[characterKey]} - ${Suit[suitKey]} ${Rank[rankKey]}`,
    symbol: "",
    image: `${index}.gif`,
    attributes: [
      {
        trait_type: "character",
        value: Character[characterKey],
      },
      {
        trait_type: "suit",
        value: Suit[suitKey],
      },
      {
        trait_type: "rank",
        value: Rank[rankKey],
      },
    ],
    collection: {
      name: COLLECTION.NAME,
      family: COLLECTION.FAMILY,
    },
    properties: {
      files: [
        {
          uri: `${index}.gif`,
          type: "image/gif",
        },
      ],
      creators: [
        {
          address: WALLET_ADDRESS,
          share: 100,
        },
      ],
    },
  };

  await fs.writeFileSync(
    `${DIST_PATH}/${index}.json`,
    JSON.stringify(metadata, null, 2)
  );
};
