"use client";
import { useEffect, useState } from 'react';
export default function AnalyticsPreference() {
 const [disabled,setDisabled]=useState<boolean | null>(null);
 useEffect(()=>{try{setDisabled(localStorage.getItem('clinic-analytics-optout')==='1');}catch{setDisabled(true);}},[]);
 return <button className="mt-5 min-h-11 rounded-xl border border-line px-5 py-3 font-semibold text-primary" disabled={disabled===null} onClick={()=>{
  try{localStorage.setItem('clinic-analytics-optout',disabled?'0':'1');location.reload();}catch{setDisabled(true);}
 }}>{disabled?'이 브라우저에서 방문 통계 허용':'이 브라우저에서 방문 통계 끄기'}</button>;
}
