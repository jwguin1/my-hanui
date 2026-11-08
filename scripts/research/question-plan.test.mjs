import test from 'node:test';
import assert from 'node:assert/strict';
import {publicationSlot,nextPublicationSlot} from './core.mjs';
import {questionPlan} from './question-plan.mjs';
import {categories} from './config.mjs';

test('four focus areas get equal slots across four weeks, KST M/W/F only',()=>{
 const counts={pain:0,diet:0,skin:0,digestive:0};
 for(let i=0;i<28;i++){
  const d=new Date(Date.parse('2026-11-08T21:00:00Z')+i*86400000),s=publicationSlot(d);
  if(s)counts[s.category]++;
 }
 assert.deepEqual(counts,{pain:3,diet:3,skin:3,digestive:3});
 assert.equal(publicationSlot(new Date('2026-11-09T00:00:00Z')).category,'pain');
 assert.equal(publicationSlot(new Date('2026-11-11T00:00:00Z')).category,'diet');
 assert.equal(publicationSlot(new Date('2026-11-13T00:00:00Z')).category,'skin');
 assert.equal(publicationSlot(new Date('2026-11-16T00:00:00Z')).category,'digestive');
});
test('legacy queued date is not filled a second time under a new category',()=>{
 const articles=[{status:'published',category:'skin',publishedAt:'2026-11-11T09:00:00+09:00'}];
 assert.equal(nextPublicationSlot(articles,new Date('2026-11-11T00:00:00Z')).publishedAt,'2026-11-13T09:00:00+09:00');
});
test('questions have matching searches; unseen topics precede previously published topics',()=>{
 for(const c of ['pain','diet','skin','digestive'])assert.equal(categories[c].questions.length,categories[c].topics.length);
 const plan=questionPlan('digestive',[{status:'published',publishedAt:'2026-11-01',editorialQuestion:{id:'digestive-1'}}]);
 assert.deepEqual(plan.map(q=>q.id),['digestive-2','digestive-3','digestive-1']);
 assert.equal(questionPlan('diet',[{status:'withdrawn',editorialQuestion:{id:'diet-1'}}])[0].count,0);
});
