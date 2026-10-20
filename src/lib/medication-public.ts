import {cache} from "react";
export type PublicLetter = {token:string;title:string;narrative:string;doctorName:string;publishedAt:string;listed?:boolean};
const origin=process.env.MEDICATION_PUBLIC_API_ORIGIN||"https://lab.jwguin.uk";
export function publicLetterPhotoUrl(token:string,size:"thumb"|"web"){
  return `${origin}/api/public/medication/letters/${token}/photo?size=${size}`;
}
export async function medicationPublicFetch(path:string){
  return fetch(`${origin}/api/public/medication/letters${path}`,{cache:"no-store",signal:AbortSignal.timeout(10000)});
}
export async function publicLetters(offset=0):Promise<{letters:PublicLetter[];hasMore:boolean;unavailable?:boolean}>{
  try{const r=await medicationPublicFetch(`?offset=${offset}`);if(!r.ok)throw Error("unavailable");return await r.json();}catch{return {letters:[],hasMore:false,unavailable:true};}
}
export const publicLetter=cache(async(token:string):Promise<PublicLetter|null>=>{
  if(!/^[a-f0-9-]{36}$/.test(token))return null;
  const r=await medicationPublicFetch(`/${token}`);if(r.status===404)return null;if(!r.ok)throw Error("복약편지를 불러오지 못했습니다. 잠시 후 다시 열어주세요.");return (await r.json()).letter;
});
