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
export function consultationEvent(href: string): 'kakao_click' | 'phone_click' | undefined {
  if (href === 'https://pf.kakao.com/_eXXun' || href === 'https://pf.kakao.com/_eXXun/chat') return 'kakao_click';
  if (href.replace(/[\s-]/g,'') === 'tel:0319767706') return 'phone_click';
}
