/** Verify published HTML, price migration and reading links. BASE may point at production. */
import assert from "node:assert/strict";
import { LIFTING_PATH, LIFTING_SLUGS } from "../src/lib/skin-guides.ts";
import { postPath } from "../src/lib/slug.ts";

const base = process.env.BASE || "http://localhost:3000";
const site = "https://www.ilsanhan.com";
const cache = new Map();
async function page(path) {
  const url = new URL(path, base);
  const key = url.pathname;
  if (!cache.has(key)) cache.set(key, (async () => {
    const response = await fetch(new URL(key, base));
    assert.equal(response.status, 200, `${key}: HTTP ${response.status}`);
    return await response.text();
  })());
  const html = await cache.get(key);
  if (url.hash) assert.ok(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing anchor`);
  return html;
}
function main(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
}
function graph(html) {
  const json = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, "JSON-LD missing");
  return JSON.parse(json)["@graph"];
}
function internalLinks(html) {
  return [...html.matchAll(/href="([^"<>]+)"/g)].map((m) => m[1]).filter((href) => href.startsWith("/") || href.startsWith("#"));
}

const hub = await page(LIFTING_PATH);
const paths = LIFTING_SLUGS.map((slug) => postPath("skin", slug));
const sitemap = await page("/sitemap.xml");
const llms = await page("/llms.txt");
for (const path of [LIFTING_PATH, ...paths]) {
  const html = await page(path);
  assert.ok(html.includes(`rel="canonical" href="${site}${path}"`), `${path}: canonical`);
  assert.ok(!/name="robots" content="[^"]*noindex/.test(html), `${path}: noindex`);
  assert.ok(sitemap.includes(`${site}${path}`), `${path}: sitemap`);
  assert.ok(llms.includes(`${site}${path}`), `${path}: llms`);
  const body = main(html);
  assert.ok(body, `${path}: server-rendered main missing`);
  assert.equal((body.match(/<h1\b/g) || []).length, 1, `${path}: one h1`);
  for (const href of internalLinks(body)) await page(href.startsWith("#") ? `${path}${href}` : href);
  if (path !== LIFTING_PATH) {
    const article = body.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert.ok(article && article.length > 500, `${path}: article HTML`);
    assert.ok(!/href="https?:/.test(article), `${path}: external article link`);
    assert.ok(body.includes(`href="${LIFTING_PATH}"`), `${path}: hub backlink`);
    assert.ok(body.includes("리프팅 질문 모음으로"), `${path}: wrong return label`);
    assert.ok(body.includes("이 글의 목차") && body.includes("관련 글"), `${path}: reading navigation`);
    assert.ok(main(hub).includes(`href="${path}"`), `${path}: hub entry link`);
    const articleNode = graph(html).find((n) => n["@type"] === "Article");
    assert.ok(articleNode?.dateModified, `${path}: article modification date`);
  }
  console.log(`PASS ${decodeURIComponent(path)}: HTML, metadata, discovery and links`);
}

const list = graph(hub).find((n) => n["@type"] === "ItemList");
assert.equal(list?.itemListElement?.length, 3, "Hub list must contain three articles");
const plainHub = main(hub).replace(/<[^>]*>/g, "");
for (const text of ["99,000원", "264,000원", "88,000원", "12주", "30분", "마취", "LED·진정 마스크팩", "부가세 포함"]) {
  assert.ok(plainHub.includes(text), `Hub missing ${text}`);
}
for (const path of ["/skin/pigmentation", postPath("skin", "피코토닝-가격-제네시스")]) {
  const body = main(await page(path));
  assert.ok(body.includes(`href="${LIFTING_PATH}"`), `${path}: migrated price link`);
  assert.ok(!body.includes("99,000") && !body.includes("264,000"), `${path}: stale lifting prices`);
  assert.ok(body.includes("88,000") && body.includes("660,000"), `${path}: toning prices lost`);
  for (const href of internalLinks(body)) await page(href.startsWith("#") ? `${path}${href}` : href);
}
const genesis = main(await page(postPath("skin", "제네시스토닝-효과")));
assert.ok(decodeURIComponent(genesis).includes("슈링크-피코토닝-제네시스-차이"), "Genesis article must link to treatment comparison");
const archive = main(await page("/skin"));
for (const path of paths) assert.ok(archive.includes(`href="${path}"`), `${path}: archive link`);
const home = await page("/");
assert.ok(main(home).includes(`href="${LIFTING_PATH}"`), "Homepage treatment entry");
const header = home.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1] ?? "";
const spot = header.indexOf('href="/skin/spot"');
const pigment = header.indexOf('href="/skin/pigmentation"');
const lifting = header.indexOf('href="/skin/lifting"');
assert.ok(spot >= 0 && pigment > spot && lifting > pigment, "Navigation order: spot → pigmentation → lifting");
console.log(`PASS price migration, navigation order, reciprocal links and ${cache.size} unique destinations (${base})`);
