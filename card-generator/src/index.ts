import Card from "./card";
import { Suit, Rank, Character } from "./constants";

const suitKeys = Object.keys(Suit);
const rankKeys = Object.keys(Rank);
const characterKeys = Object.keys(Character);

suitKeys.map((suitKey, suitIndex) => {
  const suit = Suit[suitKey];

  rankKeys.map((rankKey, rankIndex) => {
    const rank = Rank[rankKey];

    characterKeys.map((characterKey, characterIndex) => {
      const character = Character[characterKey];

      const index =
        (suitIndex * rankKeys.length + rankIndex) * characterKeys.length +
        characterIndex;

      const card = new Card(suit, rank, character);

      card.Draw(`${index}`);
    });
  });
});
