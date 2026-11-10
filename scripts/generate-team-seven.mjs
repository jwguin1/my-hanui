/** Seven-person photo: keep the complete composition on every screen. */
import fs from "node:fs/promises";
import sharp from "sharp";
const source = "assets/team-seven-source.png";
const out = "public/images";
await fs.mkdir(out, { recursive: true });
for (const [name, width] of [["team-seven", 812], ["team-seven-mobile", 720]]) {
  const photo = sharp(source).resize({ width, withoutEnlargement: true });
  await photo.clone().webp({ quality: 88 }).toFile(`${out}/${name}.webp`);
  await photo.clone().avif({ quality: 65 }).toFile(`${out}/${name}.avif`);
}
await sharp(source).resize(1200, 630, { fit: "contain", background: "#fdfbf7" })
  .jpeg({ quality: 90, mozjpeg: true }).toFile(`${out}/doctor-seven-og.jpg`);
console.log("Generated full-composition team and sharing images.");
