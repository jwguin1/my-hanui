import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { registerHooks } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import ReactMarkdown from "react-markdown";

// Production module uses Next's TypeScript path aliases; resolve them for Node's test runner.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/lib/")) return nextResolve(new URL(`../src/lib/${specifier.slice(6)}.ts`, import.meta.url).href, context);
  if (specifier.startsWith("./") && context.parentURL?.includes("/src/lib/")) {
    const target = new URL(`${specifier}.ts`, context.parentURL);
    if (fs.existsSync(target)) return nextResolve(target.href, context);
  }
  return nextResolve(specifier, context);
} });
const { autoLinkMarkdown } = await import("../src/lib/blog-local.ts");

test("overlapping Korean tags render as one valid link with unchanged readable text", () => {
  const source = "일산감비환 복용을 상담합니다.";
  const linked = autoLinkMarkdown(source, "regression-fixture");
  const html = renderToStaticMarkup(createElement(ReactMarkdown, { children: linked }));
  assert.equal((html.match(/<a /g) || []).length, 1);
  assert.equal(html.replace(/<[^>]+>/g, ""), source);
  assert.ok(!html.includes("](/"));
});

test("existing explicit links remain unchanged", () => {
  const source = "[일산감비환 안내](/diet/program)를 읽어보세요.";
  assert.equal(autoLinkMarkdown(source, "regression-fixture"), source);
});
