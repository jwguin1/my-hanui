import test from 'node:test';
import assert from 'node:assert/strict';
import {analyticsPath,sourceOrigin,consultationEvent} from '../src/lib/analytics-policy.ts';
const allowed=['/','/pain','/blog/소화불량','/research/articles/pmid-1'];
test('only known public pages on production hosts are measured',()=>{
 assert.equal(analyticsPath('www.ilsanhan.com','/pain',allowed),'/pain');
 assert.equal(analyticsPath('research.ilsanhan.com','/articles/pmid-1',allowed),'/research/articles/pmid-1');
 for(const p of ['/herbs','/herbs/patient-token','/admin','/blog/unknown-name','/%E0'])assert.equal(analyticsPath('www.ilsanhan.com',p,allowed),null);
 assert.equal(analyticsPath('preview.vercel.app','/pain',allowed),null);
 assert.equal(analyticsPath('lab.ilsanhan.com','/pain',allowed),null);
});
test('referrers discard paths, queries and identifiers; consultation events are exact matches',()=>{
 assert.equal(sourceOrigin('https://search.naver.com/search.naver?query=private'),'https://search.naver.com/');
 assert.equal(sourceOrigin('javascript:alert(1)'),'');
 assert.equal(consultationEvent('https://pf.kakao.com/_eXXun'),'kakao_click');
 assert.equal(consultationEvent('tel:031-976-7706'),'phone_click');
 assert.equal(consultationEvent('tel:01012345678'),undefined);
 assert.equal(consultationEvent('https://naver.me/IItclnGB'),'directions_click');
 assert.equal(consultationEvent('https://naver.me/some-other-clinic'),undefined);
 assert.equal(consultationEvent('https://naver.me/IItclnGB?patient=private'),undefined);
 assert.equal(consultationEvent('https://www.ilsanhan.com/contact'),undefined);
});
