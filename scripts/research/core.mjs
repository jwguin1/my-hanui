import { DOMParser } from '@xmldom/xmldom';
import { createHash } from 'node:crypto';
import { z } from 'zod';
export const normalize = s => String(s ?? '').replace(/\s+/g, ' ').trim();
export const sha256 = s => createHash('sha256').update(s).digest('hex');
export const elements = (node, tag) => Array.from(node.getElementsByTagName(tag));
export function plain(node) {
  if (!node) return '';
  if (node.nodeType === 3 || node.nodeType === 4) return node.nodeValue || '';
  return normalize(Array.from(node.childNodes || []).map(plain).join(' '));
}
export function parseXML(xml) {
  if (/<!ENTITY/i.test(xml)) throw Error('Entity declarations rejected');
  const doc = new DOMParser({onError: level => {if (level === 'fatalError') throw Error('Invalid XML');}}).parseFromString(xml, 'application/xml');
  if (!doc.documentElement) throw Error('Empty XML');
  return doc;
}
export const first = (n,t) => elements(n,t)[0];
export function allowedLicense(url) {
  return /^https?:\/\/creativecommons\.org\/(licenses\/by\/(?:2\.0|2\.5|3\.0|4\.0)|publicdomain\/zero\/1\.0)\/?(?:deed(?:\.[a-z-]+)?)?$/i.test(url || '');
}
export function parsePaper(xml) {
  const doc = parseXML(xml), article=doc.documentElement;
  const meta=first(doc,'article-meta');
  if (!meta || article.getAttribute('article-type') === 'retraction') throw Error('Not an eligible research article');
  const licenseNodes=elements(meta,'license');
  const licenseUrls=licenseNodes.flatMap(n=>[n.getAttribute('xlink:href'),...elements(n,'ext-link').map(l=>l.getAttribute('xlink:href'))]).filter(Boolean);
  const licenseUrl=licenseUrls.find(allowedLicense);
  if (!licenseUrl) throw Error('Commercial reuse license not verified');
  const body=first(doc,'body');
  if (!body) throw Error('Full text missing');
  const sections=elements(body,'sec');
  const titleOf=n=>plain(Array.from(n.childNodes).find(c=>c.nodeName==='title'));
  const methods=sections.filter(s=>/method|material|study design/i.test(titleOf(s))).map(plain).join('\n');
  const results=sections.filter(s=>/result/i.test(titleOf(s))).map(plain).join('\n');
  if (methods.length < 150 || results.length < 150) throw Error('Methods/results not available');
  const conclusionBody=sections.filter(s=>/^(?:\d+[.\s]*)?conclu/i.test(titleOf(s))).map(plain).join('\n');
  const abstract=elements(meta,'abstract').filter(n=>!n.getAttribute('abstract-type')).map(plain).join('\n');
  const conclusion=conclusionBody||abstract.match(/\bConclusions?\s*[:.]\s*([\s\S]+)$/i)?.[1]||'';
  // JATS may place cited figures outside <body> in <floats-group> or appendices.
  const figures=elements(article,'fig').map((fig,i)=>{
    const graphics=elements(fig,'graphic').map(g=>g.getAttribute('xlink:href')).filter(Boolean);
    const caption=plain(first(fig,'caption'));
    const credit=plain(first(fig,'permissions'));
    // Any distinct figure credit must be checked by a person before republication.
    if (credit || /reprinted|reproduced (?:with|from)|permission (?:of|from)|courtesy|©|copyright/i.test(caption)) throw Error('Separate figure permission requires review');
    if (!graphics.length) throw Error('Figure has no downloadable graphic');
    return {id:fig.getAttribute('id') || `fig-${i+1}`,label:plain(first(fig,'label')) || `Figure ${i+1}`,caption,graphics};
  });
  const ids=Object.fromEntries(elements(meta,'article-id').map(n=>[n.getAttribute('pub-id-type'),plain(n)]));
  const authors=elements(meta,'contrib').filter(n=>n.getAttribute('contrib-type')==='author').map(n=>plain(first(n,'name'))||plain(first(n,'collab'))).filter(Boolean);
  const excerpts=[...elements(body,'p'),...elements(body,'tr')].map(plain).filter(t=>t.length>40&&t.length<3500).map((text,index)=>({sourceId:index+1,text}));
  return {title:plain(first(meta,'article-title')),ids,authors,journal:plain(first(doc,'journal-title')),volume:plain(first(meta,'volume')),issue:plain(first(meta,'issue')),pages:plain(first(meta,'fpage'))||plain(first(meta,'elocation-id')),abstract,conclusion,methods,results,fullText:plain(body),excerpts,licenseUrl,licenseText:licenseNodes.map(plain).join(' '),figures,sourceHash:sha256(xml)};
}
const text=z.string().trim().min(10);
export const DraftSchema=z.object({
  title:z.string().min(10).max(110), summary:text.max(220), question:text.max(250),
  answer:text.max(600), population:text.max(450), methods:text.max(700), results:text.max(1300), meaning:text.max(750),
  limitations:text.max(500), consultation:text.max(450),
  tags:z.array(z.string().min(1).max(30)).min(2).max(8),
  evidence:z.array(z.object({claim:text,quote:text})).min(3).max(12),
  figures:z.array(z.object({id:z.string(),explanation:text.max(1000),alt:z.string().min(5).max(200)})),
  faq:z.array(z.object({question:text,answer:text})).min(2).max(4),
});
export const ReviewSchema=z.object({
  approved:z.boolean(), issues:z.array(z.string()),
  checks:z.object({numbers:z.boolean(),methods:z.boolean(),causality:z.boolean(),clinicalRelevance:z.boolean(),figures:z.boolean(),noPatientIdentifyingImages:z.boolean(),noInventedCredentials:z.boolean()}),
});
export function validateDraft(raw,paper) {
  const d=DraftSchema.parse(raw);
  if (d.figures.length!==paper.figures.length || new Set(d.figures.map(f=>f.id)).size!==paper.figures.length || d.figures.some(f=>!paper.figures.some(p=>p.id===f.id))) throw Error('Figure coverage mismatch');
  const corpus=normalize(paper.abstract+' '+paper.fullText);
  for (const e of d.evidence) if (!corpus.includes(normalize(e.quote))) throw Error('Evidence quote not found in source');
  const prose=[d.title,d.summary,d.answer,d.results,d.meaning,d.consultation,...d.faq.map(f=>f.answer)].join(' ');
  if (/완치|100\s*%\s*(효과|치료|보장)|부작용[이가]?\s*없|의료진[이의]?\s*검토[한했]|원장[이님]?\s*검토[한했]/.test(prose)) throw Error('Unsupported guarantee or human review claim');
  return d;
}
export function assertReview(raw) {
  const r=ReviewSchema.parse(raw);
  if (!r.approved || r.issues.length || Object.values(r.checks).some(v=>!v)) throw Error('Independent review did not approve: '+r.issues.join('; ').slice(0,600));
  return r;
}
export function dateWindow(now=new Date(),years=10) {
  const start=new Date(now); start.setUTCFullYear(start.getUTCFullYear()-years);
  return {start:start.toISOString().slice(0,10),end:now.toISOString().slice(0,10)};
}
export function eligibleDate(value,now=new Date()) {
  const {start,end}=dateWindow(now); return value>=start && value<=end;
}
export function publicationSlot(now=new Date()) {
  const kst=new Date(now.getTime()+9*3600000);
  const day=kst.getUTCDay(); const category=({1:'pain',3:'skin',5:'korean'})[day];
  return category ? {category,publishedAt:kst.toISOString().slice(0,10)+'T09:00:00+09:00'} : null;
}
export function nextPublicationSlot(articles,now=new Date(),queueSize=6){
  if(articles.filter(a=>a.status==='published'&&Date.parse(a.publishedAt)>now.getTime()).length>=queueSize)return null;
  for(let i=0;i<35;i++){
    const slot=publicationSlot(new Date(now.getTime()+i*86400000));
    if(slot&&!articles.some(a=>a.category===slot.category&&a.publishedAt.slice(0,10)===slot.publishedAt.slice(0,10)))return slot;
  }
  return null;
}
export const isVisible=(article,now=new Date())=>article.status==='published' && Date.parse(article.publishedAt)<=now.getTime();
export function rankCandidate(p,now=new Date()) {
  const age=Math.max(1,(now-Date.parse(p.date))/(365.25*86400000));
  return Math.log1p(p.citations)*3+Math.log1p(p.citations/age)*2+(/meta-analysis|systematic review|randomized controlled trial/i.test(p.types.join(' '))?3:0);
}
