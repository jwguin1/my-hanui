import fs from 'node:fs/promises';
import {config,categories} from './config.mjs';
import {nextPublicationSlot,rankCandidate} from './core.mjs';
import {discover,getPaper,crossref,checkPubMedNotice} from './sources.mjs';
import {prepareFigures,generate,saveAssets,usage} from './generate.mjs';
const file='src/data/research-articles.json';
const articles=JSON.parse(await fs.readFile(file,'utf8'));
async function persist(){
  const latest=JSON.parse(await fs.readFile(file,'utf8'));
  const merged=new Map(latest.map(a=>[a.slug,a]));
  for(const a of articles)merged.set(a.slug,a);
  await fs.writeFile(file,JSON.stringify([...merged.values()],null,2)+'\n');
}
const arg=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
// Audit even when the future queue is full. Persist withdrawals before discovery,
// so an unrelated source outage cannot prevent their removal from the website.
for(const a of articles.filter(a=>a.status==='published').sort((a,b)=>(a.lastSourceCheck||a.publishedAt).localeCompare(b.lastSourceCheck||b.publishedAt)).slice(0,15)){
  try{await crossref(a.paper.doi);await checkPubMedNotice(a.paper.pmid);a.lastSourceCheck=new Date().toISOString();}
  catch(e){if(/Retraction or correction|PubMed update/.test(e.message)){a.status='withdrawn';a.withdrawalReason='원 논문의 정정·철회 정보를 확인 중입니다.';a.updatedAt=new Date().toISOString();}else console.log('Source audit unavailable',a.slug);}
}
await persist();
const slot=nextPublicationSlot(articles,new Date(),config.queueSize);
if(!slot&&!arg('--category')){console.log('Two-week publication queue is ready.');process.exit(0);}
const category=arg('--category')||slot?.category;
const publishedAt=arg('--publish-at')||slot?.publishedAt;
if(!categories[category]||!publishedAt||!Number.isFinite(Date.parse(publishedAt)))throw Error('Valid --category and --publish-at required outside M/W/F');
if(articles.some(a=>a.category===category&&a.publishedAt.slice(0,10)===publishedAt.slice(0,10))){console.log('Publication slot already filled.');process.exit(0);}
const count=articles.filter(a=>a.category===category).length;
let success=false,attempts=0;const failures=[];
const pool=new Map();
for(let rotation=0;rotation<categories[category].topics.length;rotation++){
  for(const candidate of await discover(category,articles.map(a=>a.paper),count+rotation))pool.set(candidate.doi.toLowerCase(),candidate);
}
const candidates=[...pool.values()].sort((a,b)=>rankCandidate(b)-rankCandidate(a));
console.log('Ranked candidates',category,candidates.length);
{
  for(const c of candidates){
    if(attempts>=config.maxAttempts)break;
    try{
      const paper=await getPaper(c);
      if(category==='korean'&&!/acupunct|Chinese (?:herbal )?medicine|Korean medicine|Kampo|moxibustion/i.test(paper.title+' '+paper.abstract))throw Error('Outside Korean medicine clinical scope');
      const images=await prepareFigures(paper);attempts++;
      console.log('Verifying full paper',c.pmcid,'figures',images.length,'citations',c.citations);
      const {draft,review}=await generate(paper,category,images);
      const figures=await saveAssets(paper,images);
      articles.push({slug:`pmid-${c.pmid}`,category,status:'published',publishedAt,updatedAt:publishedAt,lastSourceCheck:new Date().toISOString(),...draft,figures:figures.map(f=>({...f,...draft.figures.find(d=>d.id===f.id)})),paper:{...c,authors:paper.authors,journal:paper.journal,volume:paper.volume,issue:paper.issue,pages:paper.pages,abstract:paper.abstract,conclusion:paper.conclusion,licenseUrl:paper.licenseUrl,licenseText:paper.licenseText,sourceUrl:paper.sourceUrl,sourceHash:paper.sourceHash,figureCount:paper.figures.length},verification:{type:'automated',model:config.model,checkedAt:new Date().toISOString(),checks:review.checks}});
      success=true;break;
    }catch(e){failures.push({pmcid:c.pmcid,reason:e.message.slice(0,700)});console.log('Held',c.pmcid,e.message.slice(0,250));}
  }
}
// Reload before saving so an independent local seed run cannot replace another category.
// Cloud executions are serialized by the workflow concurrency group.
await persist();
await fs.mkdir('output/research',{recursive:true});
await fs.writeFile('output/research/last-run.json',JSON.stringify({at:new Date().toISOString(),category,publishedAt,success,usage,failures},null,2));
console.log('Research run',JSON.stringify({success,usage}));
if(!success)process.exitCode=1;
