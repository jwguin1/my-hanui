import {setTimeout as pause} from 'node:timers/promises';
import {parseXML,elements,first,plain,parsePaper,dateWindow,eligibleDate,rankCandidate} from './core.mjs';
import {config,categories} from './config.mjs';
export async function request(url,{maxBytes=4000000,...options}={}) {
  for(let attempt=0;attempt<3;attempt++) {
    try {
      const r=await fetch(url,{...options,headers:{'User-Agent':'IlsanClinicResearch/1.0 (+https://www.ilsanhan.com/contact)',...options.headers},signal:AbortSignal.timeout(90000)});
      if(!r.ok) {if((r.status===429||r.status>=500)&&attempt<2){await pause(1500*(attempt+1));continue;}throw Error(`Source HTTP ${r.status}: ${new URL(url).hostname}`);}
      if(Number(r.headers.get('content-length'))>maxBytes)throw Error('Source exceeds size budget');
      let size=0; const chunks=[];
      for await(const c of r.body){size+=c.length;if(size>maxBytes)throw Error('Source exceeds size budget');chunks.push(c);}
      return Buffer.concat(chunks);
    } catch(e) {if(attempt===2||/Source HTTP (400|401|403|404|410)|size budget/.test(e.message))throw e;await pause(1200*(attempt+1));}
  }
}
const json=async url=>JSON.parse((await request(url)).toString());
export async function crossref(doi) {
  const data=await json('https://api.crossref.org/works/'+encodeURIComponent(doi));
  const m=data.message;
  if(!m || m.DOI?.toLowerCase()!==doi.toLowerCase())throw Error('DOI metadata mismatch');
  const changes=[...(m['updated-by']||[]),...(m['update-to']||[])];
  if(changes.some(c=>/retract|withdraw|concern|correct|errat/i.test(c.type||'')))throw Error('Retraction or correction requires review');
  return {citations:m['is-referenced-by-count']||0,citationSource:'Crossref',checkedAt:new Date().toISOString()};
}
export async function discover(category,excluded=[],offset=0) {
  const {start,end}=dateWindow(); const topic=categories[category].topics[offset%categories[category].topics.length];
  const term=`${topic} AND ("${start}"[Date - Publication] : "${end}"[Date - Publication]) NOT (preprint[Publication Type] OR retracted publication[Publication Type] OR retraction of publication[Publication Type] OR editorial[Publication Type])`;
  const q=new URL('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi');
  for(const [k,v]of Object.entries({db:'pubmed',retmode:'json',retmax:String(config.maxCandidates),sort:'relevance',term}))q.searchParams.set(k,v);
  const found=await json(q); const ids=found.esearchresult?.idlist;
  if(!ids?.length)throw Error('No PubMed candidates');
  await pause(400);
  const xml=(await request('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&id='+ids.join(','))).toString();
  const doc=parseXML(xml); const candidates=[];
  for(const article of elements(doc,'PubmedArticle')) {
    const idNodes=elements(article,'ArticleId');
    const getId=type=>plain(idNodes.find(n=>n.getAttribute('IdType')===type));
    const doi=getId('doi'),pmcid=getId('pmc'),pmid=plain(first(article,'PMID'));
    if(!doi||!/^PMC\d+$/.test(pmcid)||excluded.some(x=>x.doi?.toLowerCase()===doi.toLowerCase()||x.pmid===pmid))continue;
    const dates=elements(article,'ArticleDate');const pubdate=dates[0]||first(article,'PubDate');
    const year=plain(first(pubdate,'Year')),month=plain(first(pubdate,'Month')),day=plain(first(pubdate,'Day'));
    const mi=Number(month)||(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month.slice(0,3))+1)||1;
    const date=`${year}-${String(mi).padStart(2,'0')}-${String(Number(day)||1).padStart(2,'0')}`;
    if(!eligibleDate(date))continue;
    const types=elements(article,'PublicationType').map(plain);
    if(types.some(t=>/^(Letter|Comment|Case Reports|Clinical Trial Protocol)$/i.test(t)))continue;
    if(/protocol|animal|in vitro|bibliometric/i.test(plain(first(article,'ArticleTitle'))))continue;
    try {const citation=await crossref(doi);candidates.push({doi,pmcid,pmid,date,types,title:plain(first(article,'ArticleTitle')),...citation});}catch{continue;}
  }
  return candidates.sort((a,b)=>rankCandidate(b)-rankCandidate(a));
}
export async function getPaper(candidate) {
  const sourceUrl=`https://www.ebi.ac.uk/europepmc/webservices/rest/${candidate.pmcid}/fullTextXML`;
  const xml=(await request(sourceUrl)).toString(); const paper=parsePaper(xml);
  if(paper.ids.doi?.toLowerCase()!==candidate.doi.toLowerCase())throw Error('Full text DOI mismatch');
  if(paper.fullText.length>config.maxSourceChars)throw Error('Full text too long for complete verification');
  // PubMed exposes corrections/retractions as linked notices as well as publication types.
  await checkPubMedNotice(candidate.pmid);
  return {...paper,...candidate,sourceUrl,xml};
}
export async function checkPubMedNotice(pmid) {
  const record=(await request(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&retmode=xml`)).toString();
  if(/RefType="(?:RetractionIn|RetractionOf|ErratumIn|ExpressionOfConcernIn)"|<PublicationType[^>]*>Retracted Publication</i.test(record))throw Error('PubMed update requires review');
}
