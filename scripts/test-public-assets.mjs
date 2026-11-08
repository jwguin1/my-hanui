import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {publicAssets} from '../src/data/public-assets.ts';
import {imageSize} from '../src/lib/image-size.ts';
import {hasOgImage,hasOgWebp,postImagePath,resolveOgSource} from '../src/lib/og-image.ts';

test('indexed image dimensions match files used for article cards',async()=>{
 const images=Object.keys(publicAssets).filter(p=>/\/blog-images\/.*\/(og\.(png|webp)|img-1\.png)$/.test(p));
 assert.ok(images.length>10);
 for(const src of images){
  const m=await sharp(path.join('public',src)).metadata();
  assert.deepEqual(imageSize(src),{width:m.width,height:m.height});
 }
 assert.equal(imageSize('https://example.com/remote.jpg'),null);
 assert.equal(imageSize('/missing-image.png'),null);
});

test('OG selection keeps WebP display and PNG social links, with original fallbacks',()=>{
 for(const src of Object.keys(publicAssets).filter(p=>/\/blog-images\/.*\/og\.png$/.test(p))){
  const id=src.split('/')[2];
  assert.equal(hasOgImage(id),true);
  assert.equal(postImagePath(id,'/original.png','/fallback.png'),src);
  const webp=src.replace(/\.png$/,'.webp');
  assert.equal(hasOgWebp(id),fs.existsSync(path.join('public',webp)));
  assert.equal(postImagePath(id,'/original.png','/fallback.png','display'),Object.hasOwn(publicAssets,webp)?webp:src);
 }
 assert.equal(postImagePath('missing','/original.png','/fallback.png'),'/original.png');
 assert.equal(postImagePath('missing','','/fallback.png'),'/fallback.png');
 assert.deepEqual(resolveOgSource('missing','','![figure](/blog-images/example/img-1.png)'),{rel:'/blog-images/example/img-1.png',via:'본문 로컬 이미지 폴백'});
});
