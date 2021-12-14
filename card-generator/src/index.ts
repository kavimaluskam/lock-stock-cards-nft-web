import { draw, writeMetadata } from "./draw";
import { Suit, Rank, Character } from "./type";
import { initFont } from "./card";

const suitKeys = Object.keys(Suit);
const rankKeys = Object.keys(Rank);
const characterKeys = Object.keys(Character);

const main = async (): Promise<void> => {
  initFont();

  let characterIndex = -1;
  let suitIndex = -1;
  let rankIndex = -1;

  for (const characterKey of characterKeys) {
    characterIndex++;
    suitIndex = -1;

    for (const suitKey of suitKeys) {
      suitIndex++;
      rankIndex = -1;

      for (const rankKey of rankKeys) {
        rankIndex++;

        const index =
          (characterIndex * suitKeys.length + suitIndex) * rankKeys.length +
          rankIndex;

        await draw(characterKey, suitKey, rankKey, index);
        await writeMetadata(characterKey, suitKey, rankKey, index);
      }
    }
  }
};

main();
