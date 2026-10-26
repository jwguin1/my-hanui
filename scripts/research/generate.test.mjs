import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,usage} from './generate.mjs';
import {sourceForAI,attachEvidence,compactDraft} from './source-prompt.mjs';
import {config} from './config.mjs';

const sentence='The complete study paragraph reports the outcomes and limitations.';
const paper={title:'A complete clinical study',abstract:'Study abstract.',date:'2025-01-01',fullText:`Introduction ${sentence} Methods and tables remain here.`,excerpts:[{sourceId:1,text:sentence}],figures:[]};
const t='충분한 길이의 환자 설명 문장입니다.';
const raw={title:t,summary:t,question:t,answer:t,population:t,methods:t,results:t,meaning:t,limitations:t,consultation:t,tags:['통증','치료'],evidence:Array.from({length:3},()=>({claim:t,sourceId:1})),figures:[],faq:[{question:t,answer:t},{question:t,answer:t}]};
const checks={numbers:true,methods:true,causality:true,clinicalRelevance:true,figures:true,noPatientIdentifyingImages:true,noInventedCredentials:true};
const approved={approved:true,issues:[],checks};
const rejected={approved:false,issues:['Revise the interpretation of the result.'],checks:{...checks,causality:false}};

function provider(t,responses,inputTokens=100){
  const requests=[];
  const previous=process.env.ANTHROPIC_API_KEY;
  process.env.ANTHROPIC_API_KEY='test-key-never-sent';
  Object.assign(usage,{input:0,output:0,calls:0});
  t.after(()=>{t.mock.restoreAll();if(previous===undefined)delete process.env.ANTHROPIC_API_KEY;else process.env.ANTHROPIC_API_KEY=previous;Object.assign(usage,{input:0,output:0,calls:0});});
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    assert.equal(url,'https://api.anthropic.com/v1/messages');
    requests.push(JSON.parse(options.body));
    assert.ok(responses.length,'unexpected extra provider call');
    return new Response(JSON.stringify({stop_reason:'end_turn',usage:{input_tokens:inputTokens,output_tokens:500},content:[{type:'text',text:JSON.stringify(responses.shift())}]}),{status:200});
  });
  return requests;
}

test('complete source is sent once, with reversible evidence markers including duplicate locations',()=>{
  const input={...paper,excerpts:[...paper.excerpts,{sourceId:2,text:sentence}]};
  const source=sourceForAI(input);
  assert.equal(source.fullText.replace(/\n\[SOURCE_IDS:[\d,]+\]\n/g,''),paper.fullText);
  assert.equal(source.fullText.split(sentence).length-1,1);
  assert.match(source.fullText,/SOURCE_IDS:1,2/);
  assert.equal(source.numberedEvidenceParagraphs,undefined);
  assert.throws(()=>sourceForAI({...paper,excerpts:[{sourceId:2,text:'Not in the full source.'}]}),/missing/);
});

test('compact drafts retain all claims and resolve to the exact original evidence quotes',()=>{
  const full=attachEvidence(raw,paper);
  assert.deepEqual(compactDraft(full,paper),raw);
  assert.deepEqual(attachEvidence(compactDraft(full,paper),paper),full);
  assert.throws(()=>attachEvidence({...raw,evidence:[{claim:t,sourceId:99}]},paper),/Unknown/);
});

test('review revision keeps 3-8 evidence guidance and fits the existing budget with a single source',async t=>{
  const requests=provider(t,[raw,rejected,raw,approved],40000);
  const result=await generate(paper,'skin',[]);
  assert.equal(result.review.approved,true);
  assert.equal(requests.length,4);
  assert.equal(requests[1].model,config.reviewModel);
  assert.equal(requests[3].model,config.reviewModel);
  assert.match(requests[2].system,/3 to 8 evidence/);
  assert.match(requests[2].messages[0].content[0].text,/sourceId/);
  assert.equal(requests[2].messages[0].content[0].text.split(sentence).length-1,1);
  assert.ok(usage.input<config.maxRunInputTokens);
});

test('nine evidence entries are repaired once, then independently reviewed',async t=>{
  const invalid={...raw,evidence:Array.from({length:9},()=>raw.evidence[0])};
  const requests=provider(t,[invalid,raw,approved]);
  const result=await generate(paper,'skin',[]);
  assert.equal(requests.length,3);
  assert.match(requests[1].messages[0].content[0].text,/FORMAT REPAIR/);
  assert.equal(result.draft.evidence.length,3);
  assert.equal(requests[2].model,config.reviewModel);
});

test('repeated format violations fail closed without unlimited retries',async t=>{
  const invalid={...raw,evidence:Array.from({length:9},()=>raw.evidence[0])};
  const requests=provider(t,[invalid,invalid]);
  await assert.rejects(()=>generate(paper,'skin',[]),/8 items/);
  assert.equal(requests.length,2);
});

test('format repair cannot bypass evidence validation or independent medical review',async t=>{
  const invalid={...raw,evidence:Array.from({length:9},()=>raw.evidence[0])};
  const requests=provider(t,[invalid,raw,rejected,raw,rejected]);
  await assert.rejects(()=>generate(paper,'skin',[]),/Independent review did not approve/);
  assert.equal(requests.length,5);
});

test('budget exhaustion prevents another paid call including a format repair',async t=>{
  const requests=provider(t,[]);
  usage.input=config.maxRunInputTokens;
  await assert.rejects(()=>generate(paper,'skin',[]),/remaining budget/);
  assert.equal(requests.length,0);
});
