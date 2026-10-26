import test from 'node:test';
import assert from 'node:assert/strict';
import {isCandidateHeld,holdCandidate,canCompleteReview} from './attempt-state.mjs';
import {config} from './config.mjs';

test('review rejection persists across daily runs and releases after seven days',()=>{
  const now=new Date('2026-10-26T00:21:49Z');
  const state=holdCandidate([],'PMC123','skin',Error('Independent review did not approve: inaccurate result'),now);
  const restored=JSON.parse(JSON.stringify(state));
  assert.equal(isCandidateHeld(restored,'PMC123',new Date('2026-10-27T00:00:00Z')),true);
  assert.equal(isCandidateHeld(restored,'PMC456',now),false);
  assert.equal(isCandidateHeld(restored,'PMC123',new Date('2026-11-02T00:21:49Z')),false);
  assert.equal(JSON.stringify(state).includes('inaccurate result'),false);
});
test('format failures are held for one day while outages and budget limits remain retryable',()=>{
  const now=new Date('2026-10-26T00:00:00Z');
  const e=Error('invalid length');e.name='ZodError';
  const state=holdCandidate([],'PMC123','skin',e,now);
  assert.equal(isCandidateHeld(state,'PMC123',new Date('2026-10-26T23:59:59Z')),true);
  assert.equal(isCandidateHeld(state,'PMC123',new Date('2026-10-27T00:00:00Z')),false);
  for(const message of ['Run AI usage budget reached','AI provider HTTP 429','Source HTTP 503']){
    assert.deepEqual(holdCandidate(state,'PMC456','skin',Error(message),now),state);
  }
});
test('insufficient budget cannot start a draft that has no room for independent review',()=>{
  const source='x'.repeat(85183);
  assert.equal(canCompleteReview(source,[{},{}],{input:0,output:0},config),true);
  assert.equal(canCompleteReview(source,[{},{}],{input:180000,output:18000},config),false);
  assert.equal(canCompleteReview('short',[],{input:0,output:40000},config),false);
});
