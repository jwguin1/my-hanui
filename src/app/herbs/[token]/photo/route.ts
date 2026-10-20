import {medicationPublicFetch} from "@/lib/medication-public";
export const dynamic="force-dynamic";
export async function GET(req:Request,{params}:{params:Promise<{token:string}>}){
  const {token}=await params;if(!/^[a-f0-9-]{36}$/.test(token))return new Response(null,{status:404});
  const size=new URL(req.url).searchParams.get("size")==="thumb"?"thumb":"web";
  try{const r=await medicationPublicFetch(`/${token}/photo?size=${size}`);if(!r.ok)return new Response(null,{status:r.status===404?404:503,headers:{"Cache-Control":"no-store"}});return new Response(await r.arrayBuffer(),{headers:{"Content-Type":r.headers.get("content-type")||"image/webp","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});}catch{return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}});}
}
