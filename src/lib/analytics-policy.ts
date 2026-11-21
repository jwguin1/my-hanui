export function analyticsPath(host: string, pathname: string, allowed: readonly string[]): string | null {
  if (!['www.ilsanhan.com','ilsanhan.com','research.ilsanhan.com'].includes(host)) return null;
  let p: string;
  try { p = decodeURIComponent(pathname).normalize('NFC').replace(/\/$/, '') || '/'; } catch { return null; }
  if (host === 'research.ilsanhan.com') p = p === '/' ? '/research' : '/research' + p;
  if (p === '/herbs' || p.startsWith('/herbs/') || !allowed.includes(p)) return null;
  return p;
}
export function sourceOrigin(referrer: string): string {
  try { const url = new URL(referrer); return /^https?:$/.test(url.protocol) ? url.origin + '/' : ''; } catch { return ''; }
}
/** Use only fixed labels. A referrer's query, path and subdomain never become event dimensions. */
export function referrerGroup(referrer: string) {
  if (!referrer) return "direct_or_unknown";
  const origin = sourceOrigin(referrer);
  if (!origin) return "direct_or_unknown";
  const host = new URL(origin).hostname;
  const within = (domain: string) => host === domain || host.endsWith("." + domain);
  if (within("ilsanhan.com")) return "internal";
  if (["chatgpt.com", "chat.openai.com", "gemini.google.com", "perplexity.ai", "claude.ai", "copilot.microsoft.com"].some(within)) return "ai_referral";
  if (["google.com", "google.co.kr", "bing.com", "search.naver.com", "search.daum.net", "search.yahoo.com", "duckduckgo.com"].some(within)) return "search";
  return "other_referral";
}

/** The caller has already matched page against the allowlist of public articles and care pages. */
export function contentGroup(page: string) {
  const [, section, subpage] = page.split("/");
  if (section === "research") return "research";
  if (section === "pain" || section === "accident") return "pain";
  if (section === "skin" || section === "aftercare") return "skin";
  if (section === "diet") return "weight";
  if (section === "herbal" && subpage === "tonic") return "herbal_tonic";
  if (section === "herbal" || section === "internal" || section === "autonomic") return "internal_care";
  if (section === "home-visit") return "home_visit";
  if (section === "blog" || section === "conditions") return "patient_articles";
  return "clinic";
}

export function consultationEvent(href: string): 'kakao_click' | 'phone_click' | 'directions_click' | undefined {
  if (href === 'https://pf.kakao.com/_eXXun' || href === 'https://pf.kakao.com/_eXXun/chat') return 'kakao_click';
  if (href.replace(/[\s-]/g,'') === 'tel:0319767706') return 'phone_click';
  if (href === 'https://naver.me/IItclnGB') return 'directions_click';
}
