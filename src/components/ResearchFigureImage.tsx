"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/** 수집 단계에서 만든 경량 미리보기를 사용한다. 원본은 확대할 때만 불러오고 재압축하지 않는다. */
export default function ResearchFigureImage({src,preview,width,height,alt,label}:{src:string;preview:string;width:number;height:number;alt:string;label:string}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [zoom,setZoom] = useState(1);
  const [opened,setOpened] = useState(false);
  return <div className="research-image-viewer">
    <button ref={trigger} className="research-image-trigger" type="button" aria-label={`${label} 확대해서 보기`} onClick={()=>{setZoom(1);setOpened(true);dialog.current?.showModal();}}>
      <Image unoptimized className="research-figure-image" src={preview} width={width} height={height} alt={alt} loading="lazy" decoding="async"/>
      <span>그림 확대해서 보기 ＋</span>
    </button>
    <dialog ref={dialog} aria-label={`${label} 확대 보기`} className="research-image-dialog" onClose={()=>{setOpened(false);trigger.current?.focus({preventScroll:true});}}>
      <div className="research-image-toolbar"><strong>{label}</strong><button type="button" onClick={()=>dialog.current?.close()} aria-label="그림 확대 닫기">닫기 ✕</button></div>
      <div className="research-zoom-controls"><button type="button" disabled={zoom<=1} onClick={()=>setZoom(v=>Math.max(1,v-.5))} aria-label="그림 축소">−</button><span aria-live="polite">{Math.round(zoom*100)}%</span><button type="button" disabled={zoom>=4} onClick={()=>setZoom(v=>Math.min(4,v+.5))} aria-label="그림 확대">＋</button><a href={src} target="_blank" rel="noopener noreferrer">원본 열기 ↗</a></div>
      <p className="research-zoom-hint">확대한 그림은 좌우·위아래로 밀어 읽으세요.</p>
      <div className="research-image-scroll" tabIndex={0} aria-label="확대 그림 스크롤 영역">{opened && <Image unoptimized className="research-figure-image" src={src} alt={alt} width={width} height={height} style={{width:`${zoom*100}%`,maxWidth:"none",maxHeight:"none"}}/>}</div>
    </dialog>
  </div>;
}
