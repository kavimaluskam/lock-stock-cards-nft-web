import { createCanvas, loadImage, registerFont, Canvas } from "canvas";
import {
  Character,
  Suit,
  Rank,
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_RADIUS,
  CARD_BACKGROUND,
  SUIT_SIZE,
  SUIT_PX,
  SUIT_PY,
  RANK_FONT,
  RANK_PY,
  RANK_FONT_SIZE,
  RANK_PL,
  RANK_PR,
  RANK_10_PX_ADJUSTMENT,
} from "./constants";
import * as fs from "fs";

registerFont("./assets/fonts/card.ttf", { family: "card" });

class Card {
  suit: Suit;
  rank: Rank;
  character: Character;
  canvas: Canvas;

  constructor(suit: Suit, rank: Rank, character: Character) {
    this.suit = suit;
    this.rank = rank;
    this.character = character;
  }

  color(): string {
    return [Suit.SPADES, Suit.CLUBS].indexOf(this.suit) > -1
      ? "#000000"
      : "#de002c";
  }

  createBackgroundCanvas(): void {
    const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = CARD_BACKGROUND;
    ctx.beginPath();
    ctx.moveTo(CARD_WIDTH, CARD_HEIGHT);
    ctx.arcTo(0, CARD_HEIGHT, 0, 0, CARD_RADIUS);
    ctx.arcTo(0, 0, CARD_WIDTH, 0, CARD_RADIUS);
    ctx.arcTo(CARD_WIDTH, 0, CARD_WIDTH, CARD_HEIGHT, CARD_RADIUS);
    ctx.arcTo(CARD_WIDTH, CARD_HEIGHT, 0, CARD_HEIGHT, CARD_RADIUS);
    ctx.fill();

    this.canvas = canvas;
  }

  async drawSuit(srcDir: string): Promise<void> {
    const ctx = this.canvas.getContext("2d");
    const suitImage = await loadImage(`${srcDir}/suits/${this.suit}.png`);

    ctx.drawImage(suitImage, SUIT_PX, SUIT_PY, SUIT_SIZE, SUIT_SIZE);
    ctx.drawImage(
      suitImage,
      CARD_WIDTH - SUIT_PX - SUIT_SIZE,
      SUIT_PY,
      SUIT_SIZE,
      SUIT_SIZE
    );

    ctx.rotate(Math.PI);
    ctx.translate(-CARD_WIDTH, -CARD_HEIGHT);

    ctx.drawImage(suitImage, SUIT_PX, SUIT_PY, SUIT_SIZE, SUIT_SIZE);
    ctx.drawImage(
      suitImage,
      CARD_WIDTH - SUIT_PX - SUIT_SIZE,
      SUIT_PY,
      SUIT_SIZE,
      SUIT_SIZE
    );
  }

  drawRank(): void {
    const ctx = this.canvas.getContext("2d");

    ctx.font = `${RANK_FONT_SIZE}px ${RANK_FONT}`;
    ctx.fillStyle = this.color();

    if (this.rank === Rank.TEN) {
      ctx.fillText(this.rank, RANK_PL + RANK_10_PX_ADJUSTMENT, RANK_PY);
      ctx.fillText(this.rank, RANK_PR + RANK_10_PX_ADJUSTMENT, RANK_PY);

      ctx.rotate(Math.PI);
      ctx.translate(-CARD_WIDTH, -CARD_HEIGHT);

      ctx.fillText(this.rank, RANK_PL + RANK_10_PX_ADJUSTMENT, RANK_PY);
      ctx.fillText(this.rank, RANK_PR + RANK_10_PX_ADJUSTMENT, RANK_PY);
    } else {
      ctx.fillText(this.rank, RANK_PL, RANK_PY);
      ctx.fillText(this.rank, RANK_PR, RANK_PY);

      ctx.rotate(Math.PI);
      ctx.translate(-CARD_WIDTH, -CARD_HEIGHT);

      ctx.fillText(this.rank, RANK_PL, RANK_PY);
      ctx.fillText(this.rank, RANK_PR, RANK_PY);
    }

    // TODO: draw border for J, Q, K
    // if (
    //   this.rank === Rank.JACK ||
    //   this.rank === Rank.QUEEN ||
    //   this.rank === Rank.KING
    // ) {
    //   ctx.strokeStyle = this.color();
    //   ctx.rect(90, 90, CARD_WIDTH - 180, CARD_HEIGHT - 180);
    //   ctx.stroke();
    // }
  }

  // TODO: use gif encoder to generate gif from frames
  async drawCharacter(srcDir: string): Promise<void> {}

  async exportToFile(dirName: string, fileName: string): Promise<void> {
    fs.writeFileSync(`${dirName}/${fileName}.png`, this.canvas.toBuffer());
  }

  async Draw(
    fileName: string,
    srcDir: string = "./layers",
    distDir: string = "../assets"
  ): Promise<void> {
    this.createBackgroundCanvas();

    await this.drawSuit(srcDir);

    this.drawRank();

    await this.exportToFile(distDir, fileName);
  }
}

export default Card;
