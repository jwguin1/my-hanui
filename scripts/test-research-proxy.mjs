import assert from 'node:assert/strict';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { getPageStaticInfo } from 'next/dist/build/analysis/get-page-static-info.js';
import { loadBindings } from 'next/dist/build/swc/index.js';
import { getMiddlewareRouteMatcher } from 'next/dist/shared/lib/router/utils/middleware-route-matcher.js';

// Test the rule Next.js builds, before it calls the proxy function.
await loadBindings();
const { middleware } = await getPageStaticInfo({
  page: '/proxy',
  pageFilePath: fileURLToPath(new URL('../src/proxy.ts', import.meta.url)),
  pageType: 'pages',
  nextConfig: {},
  isDev: false,
});
const matches = getMiddlewareRouteMatcher(middleware.matchers);

test('본원·대표 도메인·미리보기 요청은 연구노트 프록시를 실행하지 않는다', () => {
  for (const host of ['www.ilsanhan.com', 'ilsanhan.com', 'my-hanui.vercel.app', 'localhost:3000']) {
    for (const path of ['/', '/doctor', '/research', '/articles/example', '/robots.txt']) {
      assert.equal(matches(path, { headers: { host } }, {}), false, host + path);
    }
  }
});

test('연구노트 도메인의 페이지는 프록시를 거치고 Next.js 정적 파일은 건너뛴다', () => {
  for (const host of ['research.ilsanhan.com', 'RESEARCH.ILSANHAN.COM', 'research.ilsanhan.com.', 'research.ilsanhan.com.:443']) {
    const request = { headers: { host } };
    for (const path of ['/', '/articles/example', '/category/pain', '/feed.xml', '/research', '/doctor']) {
      assert.equal(matches(path, request, {}), true, host + path);
    }
    for (const path of ['/_next/static/app.js', '/_next/image']) {
      assert.equal(matches(path, request, {}), false, host + path);
    }
  }
});
