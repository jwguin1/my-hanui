import {RESEARCH_ORIGIN} from '@/lib/research';
export function GET(){return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${RESEARCH_ORIGIN}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}})}
