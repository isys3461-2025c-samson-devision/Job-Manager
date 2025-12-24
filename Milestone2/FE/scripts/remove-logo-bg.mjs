import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("./src/assets");
const logoFiles = [
  "CompanyLogo1.png",
  "CompanyLogo2.png",
  "CompanyLogo3.png",
  "CompanyLogo4.png",
  "CompanyLogo5.png",
  "CompanyLogo6.png",
];

// Heuristic chroma-key: make near-light-gray background transparent.
// You can tweak these if needed.
const THRESHOLD = 28; // higher removes more background
const TARGET = { r: 240, g: 240, b: 240 }; // typical light gray

function withinThreshold(r, g, b) {
  const dr = Math.abs(r - TARGET.r);
  const dg = Math.abs(g - TARGET.g);
  const db = Math.abs(b - TARGET.b);
  return dr <= THRESHOLD && dg <= THRESHOLD && db <= THRESHOLD;
}

async function processOne(fileName) {
  const filePath = path.join(assetsDir, fileName);
  const input = await fs.readFile(filePath);

  const img = sharp(input);
  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Make top-left background color the target if it's close to light gray.
  const tlR = data[0];
  const tlG = data[1];
  const tlB = data[2];

  // If the background isn't light-ish, bail to avoid wrecking logos.
  const tlLooksLikeBg =
    withinThreshold(tlR, tlG, tlB) || (tlR > 220 && tlG > 220 && tlB > 220);
  if (!tlLooksLikeBg) {
    console.log(
      `[skip] ${fileName}: top-left pixel doesn't look like light background (${tlR},${tlG},${tlB}).`
    );
    return;
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Remove pixels near the sampled light background
    if (withinThreshold(r, g, b) || (r > 245 && g > 245 && b > 245)) {
      data[i + 3] = 0;
    }
  }

  const out = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  await fs.writeFile(filePath, out);
  console.log(`[ok] ${fileName}: wrote transparent background`);
}

async function main() {
  for (const f of logoFiles) await processOne(f);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
