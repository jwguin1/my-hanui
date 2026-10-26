import {z} from 'zod';
import {DraftSchema} from './core.mjs';

export const WriterSchema=DraftSchema.extend({
  evidence:z.array(z.object({claim:z.string().min(10),sourceId:z.number().int().positive()})).min(3).max(8),
});
export const writerRules='Return exactly 3 to 8 evidence items, each with claim and sourceId only (no quote). Keep every field within its schema length limit. Revising a draft does not change these limits.';

// Keep the entire body, including tables, but do not send it again as an array
// of evidence paragraphs. Mark their locations in the one complete source.
export function sourceForAI(paper){
  const markers=new Map();
  for(const p of paper.excerpts){
    const start=paper.fullText.indexOf(p.text);
    if(start<0)throw Error('Evidence paragraph missing from full source');
    markers.set(start,[...(markers.get(start)||[]),p.sourceId]);
  }
  let fullText='',cursor=0;
  for(const [start,ids]of [...markers].sort((a,b)=>a[0]-b[0])){
    fullText+=paper.fullText.slice(cursor,start)+`\n[SOURCE_IDS:${ids.join(',')}]\n`;
    cursor=start;
  }
  fullText+=paper.fullText.slice(cursor);
  return {title:paper.title,date:paper.date,abstract:paper.abstract,fullText,figures:paper.figures};
}

export function attachEvidence(raw,paper){
  return {...raw,evidence:raw.evidence.map(e=>{
    const p=paper.excerpts.find(p=>p.sourceId===e.sourceId);
    if(!p)throw Error('Unknown source paragraph');
    return {claim:e.claim,quote:p.text};
  })};
}

export function compactDraft(draft,paper){
  return {...draft,evidence:draft.evidence.map(e=>{
    const p=paper.excerpts.find(p=>p.text===e.quote);
    return p?{claim:e.claim,sourceId:p.sourceId}:e;
  })};
}
