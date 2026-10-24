import fs from 'node:fs/promises';
import path from 'node:path';
import {parsePaper,validateDraft,assertReview,sha256,allowedLicense} from './core.mjs';
const articles=JSON.parse(await fs.readFile('src/data/research-articles.json','utf8'));
const ids=new Set();
for(const a of articles){
  if(ids.has(a.paper.doi.toLowerCase()))throw Error('Duplicate DOI');ids.add(a.paper.doi.toLowerCase());
  if(!/^pmid-\d+$/.test(a.slug)||!['pain','skin','korean'].includes(a.category))throw Error('Invalid route');
  if(!Number.isFinite(Date.parse(a.publishedAt)))throw Error('Invalid publication date');
  const xml=await fs.readFile(`public/research-assets/${a.paper.pmcid}/source.xml`,'utf8');
  const p=parsePaper(xml);validateDraft(a,p);
  if(!allowedLicense(a.paper.licenseUrl)||sha256(xml)!==a.paper.sourceHash||p.ids.doi.toLowerCase()!==a.paper.doi.toLowerCase())throw Error('Source/license mismatch');
  assertReview({approved:true,issues:[],checks:a.verification.checks});
  if(a.figures.length!==p.figures.length||a.paper.figureCount!==p.figures.length)throw Error('Figure missing');
  for(const f of a.figures){const source=p.figures.find(s=>s.id===f.id);if(!source||f.images.length!==source.graphics.length)throw Error('Figure panel missing');for(const img of f.images)for(const key of ['src','preview']){if(!img[key].startsWith(`/research-assets/${a.paper.pmcid}/`)||img[key].includes('..'))throw Error('Unsafe asset path');await fs.access(path.join('public',img[key]));}}
}
console.log(`Validated ${articles.length} research articles: sources, licenses, evidence, review gates and all figure files.`);
