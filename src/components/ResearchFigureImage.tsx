"use client";

import { useRef, useState } from "react";

/** 원본 그림을 같은 화면에서 확대하고, 닫으면 읽던 위치로 돌아간다. */
export default function ResearchFigureImage({src,preview,width,height,alt,label}:{src:string;preview:string;width:number;height:number;alt:string;label:string}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [zoom,setZoom] = useState(1);
  return <div className="research-image-viewer">
    <button ref={trigger} className="research-image-trigger" type="button" aria-label={`${label} 확대해서 보기`} onClick={()=>{setZoom(1);dialog.current?.showModal();}}>
      <img className="research-figure-image" src={preview} width={width} height={height} alt={alt} loading="lazy" decoding="async"/>
      <span>그림 확대해서 보기 ＋</span>
    </button>
    <dialog ref={dialog} className="research-image-dialog" onClose={()=>trigger.current?.focus({preventScroll:true})}>
      <div className="research-image-toolbar"><strong>{label}</strong><button type="button" onClick={()=>dialog.current?.close()} aria-label="그림 확대 닫기">닫기 ✕</button></div>
      <div className="research-zoom-controls"><button type="button" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.5))} aria-label="그림 축소">−</button><span aria-live="polite">{Math.round(zoom*100)}%</span><button type="button" disabled={zoom>=4} onClick={()=>setZoom(v=>Math.min(4,v+.5))} aria-label="그림 확대">＋</button><a href={src} target="_blank" rel="noopener noreferrer">원본 열기 ↗</a></div>
      <p className="research-zoom-hint">확대한 그림은 좌우·위아래로 밀어 읽으세요.</p>
      <div className="research-image-scroll" tabIndex={0} aria-label="확대 그림 스크롤 영역"><img className="research-figure-image" src={src} alt={alt} width={width} height={height} style={{width:`${zoom*100}%`,maxWidth:"none",maxHeight:"none"}} loading="lazy"/></div>
    </dialog>
  </div>;
}
