# Research notes operations

Origin: https://research.ilsanhan.com. Hosted by the existing my-hanui Vercel project; Gabia CNAME research points to its Vercel DNS target. Host-based routing in src/proxy.ts isolates the research home, articles, sitemap, robots and feed. Existing clinic paths on that host redirect to www.ilsanhan.com.

## Storage and execution

Public articles: src/data/research-articles.json. Licensed figures and evidence XML: public/research-assets/PMC*/. These are website deployment assets served by Vercel, versioned in the website repository. No research files, jobs or backups are added to Lab. Research files are public; never add patient information, credentials or internal clinic records. Rendered pages filter scheduled/draft/withdrawn posts; the public repository itself is not a confidential draft store.

GitHub Actions runs daily at 06:17 Korea time and fills the next unoccupied Monday/Wednesday/Friday 09:00 slot, up to six queued articles. Scheduled pages only appear at their own publication time; daily preparation does not mean daily publication. Scheduler delays are possible; publication can be late after source/API failures. Manual runs have a validate-only default. Date/category deduplication makes retries safe. A single concurrency group serializes runs. The GitHub repository must remain active: scheduled workflows in public repositories can be disabled by GitHub after extended inactivity; successful publication commits keep activity present, but prolonged failures need attention.

Workflow secret RESEARCH_ANTHROPIC_API_KEY is only exposed to the generation step. It must never be placed in a public file, article or log. Existing clinic Anthropic billing is used; writer/reviewer models and per-run token ceilings are in scripts/research/config.mjs. The writer is Sonnet 5.5 and the independent reviewer is Opus 5.5. Maximum 3 eligible-paper attempts; separate writer/reviewer calls, at most one revision per paper. Responses use the provider's structured JSON output and are validated again locally. Provider error details redact the API key. Actions failures are visible in the repository's normal notification settings. No patient messaging is sent by this job.

## Editorial process

PubMed candidate search is within a rolling decade. Crossref citations and citations/year contribute to ranking within each query's candidate pool, together with study design. This is not an exhaustive ranking of every indexed paper. Topic rotates after each successful publication. PubMed correction/retraction links and Crossref updates block new publication. Recent/least recently checked published posts are rechecked in batches of 15 on each run. A retraction/correction flag withdraws the article from public pages/sitemap/feed after deployment; transient API failures do not withdraw it.

Only explicit CC BY (2.0–4.0) or CC0 licenses pass. Source DOI, full methods/results, source hash and all body Figure assets must match. Any distinct figure permission notice blocks automatic republication. Source HTML is not rendered; JSX escapes plain text. Zip paths are never extracted to disk. File type, image dimensions and download/expansion budgets are limited. The AI sees source text/images as untrusted data, has no tools, and returns a schema-validated object. Claims map to real source paragraphs. Independent AI review must pass all criteria, including identifiable-image checks. AI checking does not constitute physician review or ensure every error is found.

## Operate / pause / correct

Open https://github.com/jwguin1/my-hanui/actions/workflows/research-publish.yml in the clinic's GitHub account. Run workflow → validate checks existing content without generating or publishing. Publish requires category and publication date. Disable workflow pauses automatic generation. Re-enable to resume; do not create a duplicate schedule.

For an article correction, edit its object in src/data/research-articles.json and update updatedAt. Set status to draft or withdrawn to remove it from rendered pages, listing, sitemap and RSS; scheduled entries only appear at publishedAt. A licensed original remains in version history. Delete no shared assets without checking references. Human review is added only after actual review, as humanReview: {name, date}. This is optional and never AI-generated.

Tests: node --test scripts/research/core.test.mjs; node scripts/research/validate.mjs; npx tsc --noEmit --incremental false; npm run build. Check deployed root/category/article/sitemap/feed, correct canonical hostname, mobile readability and full-size figures. Full-site deployment failure must be fixed before considering a scheduled article published.

## Launch verification — 2026-10-24

Three launch notes are public (PMID 38693474, 36674277, 30521155). Their seven Figures in total are present; the dysmenorrhea paper has no Figure. All three final texts passed the separate Opus 5.5 source/image check. GitHub Actions run 40080512681 completed the full discovery/write/review/commit workflow and Vercel deployed its commit fb9a422 successfully. It queued PMID 32723399 for 2026-10-26 09:00 KST. Deployed HTTP checks confirmed that scheduled article returns 404 and is absent from the sitemap/feed until its publication time. Mobile views at 360, 390 and 430 pixels were checked, along with search and expandable Q&A. Browser tabs and the user's apps were left open.
