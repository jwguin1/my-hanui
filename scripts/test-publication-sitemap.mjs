import test from 'node:test';
import assert from 'node:assert/strict';
import { publicationSitemapResponse, publicationPage } from '../src/lib/publication-sitemap.ts';

const token = '11111111-2222-4333-8444-555555555555';
test('공개 목록만 XML로 만들고 중복 토큰과 시각 표기를 정규화한다', async () => {
  const fetcher = async (url, options) => {
    assert.equal(url, 'https://example.test/api/public/medication/sitemap');
    assert.equal(options.cache, 'no-store');
    return Response.json({ letters: [{token,publishedAt:'2026-10-24T09:00:00+09:00'}, {token,publishedAt:'2026-10-24T09:00:00+09:00'}] });
  };
  const r = await publicationSitemapResponse(fetcher, 'https://example.test');
  assert.equal(r.status, 200);
  const xml = await r.text();
  assert.equal((xml.match(/<loc>/g)||[]).length, 1);
  assert.ok(xml.includes('2026-10-24T00:00:00.000Z'));
  assert.ok(xml.includes('https://www.ilsanhan.com/herbs/'+token));
});
test('연결 실패·오류 응답·잘못된 데이터는 빈 200 대신 재시도 가능한 503이다', async () => {
  for (const fetcher of [
    async()=>{throw new Error('connection failed');},
    async()=>new Response('failure',{status:500}),
    async()=>Response.json({}),
    async()=>Response.json({letters:[{token:'<bad>',publishedAt:'2026-10-24'}]}),
    async()=>Response.json({letters:[{token,publishedAt:'invalid'}]}),
  ]) {
    const r = await publicationSitemapResponse(fetcher);
    assert.equal(r.status,503);
    assert.equal(r.headers.get('Retry-After'),'300');
    assert.equal(r.headers.get('Cache-Control'),'no-store');
    assert.ok(!(await r.text()).includes('<urlset'));
  }
});
test('실제 빈 공개 목록은 정상 빈 사이트맵이다',async()=>{
  const r=await publicationSitemapResponse(async()=>Response.json({letters:[]}));
  assert.equal(r.status,200);assert.ok((await r.text()).includes('<urlset'));
});
test('페이지 주소와 조회 offset은 동일한 정수 페이지를 사용한다',()=>{
  for(const [input,expected] of [[undefined,1],['',1],['-1',1],['NaN',1],['Infinity',1],['2.9',2],['2',2],['10001',10000]]) assert.equal(publicationPage(input),expected);
});
