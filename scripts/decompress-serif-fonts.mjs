import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { decompress } from 'wawoff2';

await mkdir('tmp/font-subsets', { recursive: true });
for (const weight of ['Regular', 'SemiBold', 'Bold']) {
  const source = await readFile(`public/fonts/NotoSerifKR-${weight}.woff2`);
  await writeFile(`tmp/font-subsets/${weight}.ttf`, await decompress(source));
}
