import {NextRequest,NextResponse} from 'next/server';
export function proxy(request:NextRequest){
  // A fully qualified Host may end in a dot, including before an explicit port.
  const hostname=(request.headers.get('host')||request.nextUrl.hostname).toLowerCase().replace(/:\d+$/,'').replace(/\.$/,'');
  if(hostname!=='research.ilsanhan.com')return NextResponse.next();
  const url=request.nextUrl.clone();const p=url.pathname;
  if(p.startsWith('/_next/')||p.startsWith('/research-assets/')||p.startsWith('/fonts/')||['/favicon.ico','/icon.png','/apple-icon.png','/og-image.jpg'].includes(p))return NextResponse.next();
  if(p==='/research'||p.startsWith('/research/')){const canonical=new URL('https://research.ilsanhan.com');canonical.pathname=p.replace(/^\/research/,'')||'/';canonical.search=url.search;return NextResponse.redirect(canonical,308);}
  if(p==='/'||/^\/(articles|category)(\/|$)/.test(p)||['/editorial','/sitemap.xml','/robots.txt','/feed.xml','/llms.txt'].includes(p)){
    url.pathname='/research'+(p==='/'?'':p);return NextResponse.rewrite(url);
  }
  // Assign the path separately so a leading // cannot replace the clinic host.
  const clinic=new URL('https://www.ilsanhan.com');clinic.pathname=p;clinic.search=url.search;
  return NextResponse.redirect(clinic,308);
}
export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image).*)',
      has: [{ type: 'host', value: 'research\\.ilsanhan\\.com\\.?' }],
    },
  ],
};
