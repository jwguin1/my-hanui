import {NextRequest,NextResponse} from 'next/server';
export function proxy(request:NextRequest){
  const hostname=(request.headers.get('host')||request.nextUrl.hostname).split(':')[0].toLowerCase();
  if(hostname!=='research.ilsanhan.com')return NextResponse.next();
  const url=request.nextUrl.clone();const p=url.pathname;
  if(p.startsWith('/_next/')||p.startsWith('/research-assets/')||p.startsWith('/fonts/')||['/favicon.ico','/icon.png','/apple-icon.png','/og-image.jpg'].includes(p))return NextResponse.next();
  if(p==='/research'||p.startsWith('/research/')){const canonical=new URL('https://research.ilsanhan.com');canonical.pathname=p.replace(/^\/research/,'')||'/';canonical.search=url.search;return NextResponse.redirect(canonical,308);}
  if(p==='/'||/^\/(articles|category)(\/|$)/.test(p)||['/editorial','/sitemap.xml','/robots.txt','/feed.xml','/llms.txt'].includes(p)){
    url.pathname='/research'+(p==='/'?'':p);return NextResponse.rewrite(url);
  }
  return NextResponse.redirect(new URL(p+url.search,'https://www.ilsanhan.com'),308);
}
export const config={matcher:['/((?!_next/static|_next/image).*)']};
