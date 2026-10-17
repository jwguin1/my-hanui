import {medicationPublicFetch} from "@/lib/medication-public";
export const dynamic="force-dynamic";
export async function GET(_req:Request,{params}:{params:Promise<{token:string}>}){
  const {token}=await params;if(!/^[a-f0-9-]{36}$/.test(token))return new Response(null,{status:404});
  try{const r=await medicationPublicFetch(`/${token}/photo`);if(!r.ok)return new Response(null,{status:r.status===404?404:503,headers:{"Cache-Control":"no-store"}});return new Response(await r.arrayBuffer(),{headers:{"Content-Type":"image/png","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});}catch{return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}});}
}
