import { readdir } from 'node:fs/promises';
import sharp from 'sharp';

// Keep original JPEG URLs for metadata and search; browsers select a smaller WebP.
const directory = 'public/images/hero';
for (const name of await readdir(directory)) {
  if (!name.endsWith('-hero.jpg')) continue;
  for (const width of [480, 768, 1080]) {
    await sharp(`${directory}/${name}`).resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 }).toFile(`${directory}/${name.replace('.jpg', `-${width}.webp`)}`);
  }
}
