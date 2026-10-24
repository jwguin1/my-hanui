import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {isVisible} from './core.mjs';
const origin=process.env.RESEARCH_SMOKE_ORIGIN||'https://research.ilsanhan.com';
const articles=JSON.parse(await fs.readFile('src/data/research-articles.json','utf8'));
function get(path){return new Promise((resolve,reject)=>{
  const url=new URL(path,origin);
  const req=(url.protocol==='https:'?https:http).get(url,{headers:{Host:'research.ilsanhan.com'}},r=>{
    const chunks=[];r.on('data',c=>chunks.push(c));r.on('end',()=>resolve({status:r.statusCode,headers:r.headers,body:Buffer.concat(chunks).toString()}));
  });req.on('error',reject);req.setTimeout(45000,()=>req.destroy(Error('HTTP timeout')));
});}
const home=await get('/');assert.equal(home.status,200);assert.match(home.body,/논문 속 근거를/);assert.match(home.body,/rel="canonical" href="https:\/\/research.ilsanhan.com/);
for(const path of ['/category/pain','/category/skin','/category/korean','/editorial','/sitemap.xml','/feed.xml','/robots.txt','/llms.txt'])assert.equal((await get(path)).status,200,path);
const sitemap=(await get('/sitemap.xml')).body,feed=(await get('/feed.xml')).body;
for(const a of articles){
  const page=await get('/articles/'+a.slug);
  if(!isVisible(a)){assert.equal(page.status,404,a.slug);assert.ok(!sitemap.includes(a.slug));assert.ok(!feed.includes(a.slug));continue;}
  assert.equal(page.status,200,a.slug);assert.ok(page.body.includes(a.title));assert.ok(sitemap.includes(a.slug));
  assert.match(page.body,/"@type":"BlogPosting"/);assert.match(page.body,/"@type":"ScholarlyArticle"/);assert.match(page.body,/"@type":"FAQPage"/);
  for(const match of page.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
  for(const f of a.figures)for(const image of f.images){assert.ok(page.body.includes(image.preview));assert.equal((await get(image.src)).status,200,image.src);assert.equal((await get(image.preview)).status,200,image.preview);}
}
const redirect=await get('/contact');assert.equal(redirect.status,308);assert.equal(redirect.headers.location,'https://www.ilsanhan.com/contact');
assert.equal((await get('/articles/not-a-real-article')).status,404);
console.log(`Research HTTP smoke passed: ${articles.length} articles, all figures, scheduled visibility, metadata, feed and clinic routing.`);
