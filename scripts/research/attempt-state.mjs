export function isCandidateHeld(state,pmcid,now=new Date()){
  return state.some(a=>a.pmcid===pmcid&&Date.parse(a.retryAfter)>now.getTime());
}

export function holdCandidate(state,pmcid,category,error,now=new Date()){
  // Network/provider/budget failures are transient and must not blacklist papers.
  const message=error.message||'';
  const reason=/Independent review did not approve/.test(message)?'independent-review':
    error.name==='ZodError'||/Unknown source paragraph|Evidence quote not found|Figure coverage mismatch|Unsupported guarantee/.test(message)?'draft-validation':null;
  if(!reason)return state;
  const days=reason==='independent-review'?7:1;
  return [...state.filter(a=>a.pmcid!==pmcid&&Date.parse(a.retryAfter)>now.getTime()),
    {pmcid,category,reason,failedAt:now.toISOString(),retryAfter:new Date(now.getTime()+days*86400000).toISOString()}];
}

export function canCompleteReview(source,images,usage,config){
  // Reserve four calls: writing, independent review, one revision, final review.
  // Allow room for images, instructions and the draft in subsequent prompts.
  const perCall=Math.ceil(source.length/2)+images.length*2000+8000;
  return usage.input+perCall*4<=config.maxRunInputTokens&&usage.output+12000*4<=config.maxRunOutputTokens;
}
