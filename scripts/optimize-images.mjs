import { stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CHECK_ONLY = process.argv.includes("--check");

const assets = [
  { name: "rpg-life-tree", formats: ["avif", "webp"] },
  { name: "rpg-product-world-map", formats: ["avif", "webp"] },
  { name: "rpg-quest-book", formats: ["avif", "webp"] },
  { name: "rpg-trial-portal", formats: ["avif", "webp"] },
  { name: "rpg-trial-portal-mobile", formats: ["avif", "webp"] },
  { name: "rpg-trial-portal-alpha", formats: ["avif", "webp"] },
  { name: "rpg-trial-portal-mobile-alpha", formats: ["avif", "webp"] },
  { name: "sprite-jelly", formats: ["webp"], sprite: true },
  { name: "sprite-bat", formats: ["webp"], sprite: true },
  { name: "sprite-wolf", formats: ["webp"], sprite: true },
  { name: "sprite-lol-dragon", formats: ["webp"], sprite: true },
];

const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function encode(source, destination, format, sprite) {
  const image = sharp(source, { failOn: "warning" });
  if (format === "avif") {
    await image
      .avif({ quality: 58, effort: 6, chromaSubsampling: "4:4:4" })
      .toFile(destination);
    return;
  }

  await image
    .webp({
      quality: sprite ? 88 : 84,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(destination);
}

async function main() {
  let sourceTotal = 0;
  let preferredTotal = 0;

  for (const asset of assets) {
    const source = path.join(PUBLIC_DIR, `${asset.name}.png`);
    const sourceSize = (await stat(source)).size;
    sourceTotal += sourceSize;

    for (const format of asset.formats) {
      const destination = path.join(PUBLIC_DIR, `${asset.name}.${format}`);
      if (!CHECK_ONLY) await encode(source, destination, format, asset.sprite);

      let outputSize;
      try {
        outputSize = (await stat(destination)).size;
      } catch {
        throw new Error(`Missing optimized asset: ${path.relative(process.cwd(), destination)}`);
      }

      if (outputSize >= sourceSize) {
        throw new Error(`${asset.name}.${format} is not smaller than its PNG source`);
      }
      if (format === "avif" || asset.formats.length === 1) preferredTotal += outputSize;
      console.log(`${asset.name}.${format}: ${kilobytes(sourceSize)} -> ${kilobytes(outputSize)}`);
    }
  }

  const ratio = preferredTotal / sourceTotal;
  if (ratio > 0.35) {
    throw new Error(`Preferred image payload is ${(ratio * 100).toFixed(1)}% of PNG sources; budget is 35%`);
  }

  console.log(
    `${CHECK_ONLY ? "Verified" : "Generated"} preferred payload: ${kilobytes(sourceTotal)} -> ${kilobytes(preferredTotal)} (${(ratio * 100).toFixed(1)}%)`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
