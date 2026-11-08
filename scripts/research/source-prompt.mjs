import {z} from 'zod';
import {DraftSchema} from './core.mjs';

export const WriterSchema=DraftSchema.extend({
  evidence:z.array(z.object({claim:z.string().min(10),sourceId:z.number().int().positive()})).min(3).max(8),
});
export const patientWritingRules=`Write Korean that sounds like a short explanation in a consultation. Answer the patient's question in the first sentence. Prefer concrete observations and next steps over generic reassurance, meta commentary or repeated disclaimers. Avoid stock expressions such as 살펴보겠습니다, 결론적으로, 핵심은, 여정, 맞춤형 솔루션, 저희가 하는 일은 거기까지입니다. Do not repeat location-keyword variants or the same paragraph in different headings. Instead of an uninformative 확인되지 않았습니다 or 확실하지 않습니다, specify exactly what was measured, in whom, for how long, and what remains outside that scope. For example, if supported by the source, say 이 연구는 19명을 1년까지 관찰했습니다. Describe null results as null results, missing harm reporting as missing reporting, and small or uncontrolled studies as such. Never convert uncertainty, a nonsignificant result or an unmeasured outcome into a positive efficacy or safety claim. Preserve urgent-care advice and clinically relevant harms. Put concise study limitations in the limitations field; avoid repeating them in each FAQ and the consultation. The consultation should say what the clinic will assess and how the patient can prepare, without inventing clinical experience, results or a clinician review.`;
export const writerRules='Return exactly 3 to 8 evidence items, each with claim and sourceId only (no quote). Keep every field within its schema length limit. This is a text-only publication: return figures as an empty array, including in revisions. Explain the important findings from source figures in the results and meaning fields using self-contained text with comparison groups, units and time points. Never ask the reader to look at an attached image or refer to above/below figures. Revising a draft does not change these limits. '+patientWritingRules;

export function writerSchemaFor(){
  return WriterSchema.extend({figures:DraftSchema.shape.figures.length(0)});
}

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
