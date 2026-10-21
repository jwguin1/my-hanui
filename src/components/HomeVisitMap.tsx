"use client";

import { useState } from "react";
import { CLINIC } from "@/lib/clinic";
import { HOME_VISIT_REGION_GROUPS } from "@/lib/home-visit";
import map from "@/lib/home-visit-map.json";

function project(lon: number, lat: number) {
  const p = map.projection;
  return [p.left + (lon - p.minx) * p.cos * p.scale, p.top + (p.maxy - lat) * p.scale];
}
const point = (lon: number, lat: number) => project(lon, lat).join(",");
// Rounded service-area guide, not an administrative boundary or driving-time radius.
const coverage = `M${point(126.25, 37.76)}
 C${point(126.24, 37.98)} ${point(126.72, 38.06)} ${point(127.03, 38.07)}
 C${point(127.28, 38.17)} ${point(127.46, 38.11)} ${point(127.42, 37.88)}
 C${point(127.40, 37.71)} ${point(127.39, 37.51)} ${point(127.26, 37.42)}
 C${point(127.13, 37.31)} ${point(127.04, 37.26)} ${point(126.80, 37.22)}
 C${point(126.55, 37.20)} ${point(126.34, 37.32)} ${point(126.31, 37.48)}
 C${point(126.25, 37.58)} ${point(126.23, 37.67)} ${point(126.25, 37.76)}Z`;

// Nearby cities share a callout so names remain legible on a phone.
const LABELS: [string, number, number, number, number][] = [
  ["파주", 126.78, 37.76, 290, 220],
  ["동두천", 127.06, 37.90, 370, 145],
  ["포천", 127.20, 37.90, 515, 192],
  ["양주·의정부", 127.04, 37.76, 422, 263],
  ["강화", 126.49, 37.75, 126, 255],
  ["김포", 126.72, 37.62, 237, 350],
  ["영종도", 126.53, 37.49, 133, 416],
  ["남양주", 127.22, 37.64, 540, 319],
  ["하남", 127.21, 37.54, 542, 390],
  ["시흥·안산", 126.82, 37.34, 275, 525],
  ["군포·안양·과천", 126.97, 37.40, 445, 482],
];

export default function HomeVisitMap() {
  const [zoomed, setZoomed] = useState(false);
  const [x, y] = project(CLINIC.geo.longitude, CLINIC.geo.latitude);
  return <figure id="visit-coverage-map" className="mx-auto mt-10 max-w-5xl scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-[var(--bg)]">
    <div className="grid lg:grid-cols-[1.35fr_1fr]">
      <div className="min-w-0 bg-[#f0f5f3]">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 lg:hidden">
          <p className="text-sm text-ink">{zoomed ? "좌우로 밀어 지역을 확인하세요" : "지명을 더 크게 볼 수 있어요"}</p>
          <button type="button" aria-pressed={zoomed} aria-controls="visit-map-scroll" onClick={() => setZoomed(!zoomed)} className="min-h-11 shrink-0 rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary">{zoomed ? "전체 지도" : "지도 확대"}</button>
        </div>
        <div id="visit-map-scroll" tabIndex={0} role="region" aria-label="방문진료 지도. 확대 시 좌우로 이동할 수 있습니다." className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-primary">
        <svg viewBox="0 0 640 610" role="img" aria-labelledby="visit-map-title visit-map-desc" className={`block h-auto w-full ${zoomed ? "min-w-[640px] lg:min-w-0" : ""}`}>
          <title id="visit-map-title">풍산역 일산한의원에서 출발하는 방문진료 권역</title>
          <desc id="visit-map-desc">북쪽 파주·의정부·동두천·포천·양주, 남쪽 시흥·안산·군포·안양·과천, 서쪽 강화·영종도·김포, 동쪽 남양주·하남을 둘러싼 권역과 그 안쪽 지역을 표시한 안내도입니다. 출발점은 고양시 일산동구 풍산역의 일산한의원입니다.</desc>
          <defs>
            <clipPath id="visit-map-frame"><rect width="640" height="610" /></clipPath>
            <clipPath id="visit-map-land">{Object.entries(map.paths).map(([name, d]) => <path key={name} d={d} clipRule="evenodd" />)}</clipPath>
          </defs>
          <g clipPath="url(#visit-map-frame)" strokeLinejoin="round">
            {Object.entries(map.paths).map(([name, d]) => <path key={name} d={d} fill="#e1e8e3" stroke="#b6c6bd" strokeWidth="1.2" fillRule="evenodd" />)}
            <path d={coverage} fill="#96c8b1" fillOpacity=".7" clipPath="url(#visit-map-land)" />
            <path d={coverage} fill="none" stroke="#216b55" strokeWidth="4" strokeDasharray="10 6" />
            <path d={map.paths.Seoul} fill="#579b7e" stroke="#fff" strokeWidth="1.5" />
            <text x="385" y="370" textAnchor="middle" fontSize="32" fontWeight="700" fill="#fff">서울</text>
            {LABELS.map(([label, lon, lat, lx, ly]) => {
              const [px, py] = project(lon, lat);
              return <g key={label}>
                <path d={`M${px},${py}L${lx},${ly - 10}`} stroke="#557967" strokeWidth="1.5" />
                <circle cx={px} cy={py} r="3.5" fill="#216b55" />
                <text x={lx} y={ly} textAnchor="middle" fontSize="28" fontWeight="600" fill="#234d3b" paintOrder="stroke" stroke="#f0f5f3" strokeWidth="5">{label}</text>
              </g>;
            })}
            <circle cx={x} cy={y} r="17" fill="#fff" opacity=".85" />
            <circle cx={x} cy={y} r="9" fill="#6b4226" stroke="#fff" strokeWidth="3" />
            <path d={`M${x},${y - 12}L186,137`} fill="none" stroke="#6b4226" strokeWidth="2" />
            <rect x="28" y="55" width="274" height="82" rx="12" fill="#fff" stroke="#d6c8b9" />
            <text x="45" y="88" fontSize="28" fontWeight="700" fill="#6b4226">출발 · 일산한의원</text>
            <text x="45" y="119" fontSize="25" fill="#5b655e">일산동구 · 풍산역</text>
            <g transform="translate(594 35)" fill="#566f63"><text x="0" y="0" textAnchor="middle" fontSize="22">N</text><path d="M0 10L-5 24L0 21L5 24Z" /><path d="M0 21V42" stroke="#566f63" /></g>
            <text x="320" y="580" textAnchor="middle" fontSize="25" fontWeight="600" fill="#216b55">점선으로 둘러싼 권역 안쪽을 방문합니다</text>
          </g>
        </svg>
        </div>
      </div>
      <div className="p-5 md:p-8 lg:self-center">
        <p className="text-sm font-semibold text-primary">방문 권역 한눈에 보기</p>
        <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink">아래 지역을 잇는 권역과<br />그 안쪽으로 찾아갑니다</h3>
        <p className="mt-4 text-base leading-relaxed text-ink">서울·고양도 방문 권역에 포함됩니다.</p>
        <dl className="mt-5 divide-y divide-line">
          {HOME_VISIT_REGION_GROUPS.map(g => <div key={g.direction} className="grid grid-cols-[3rem_1fr] gap-3 py-4 text-base leading-[1.8]">
            <dt className="font-semibold text-primary">{g.direction}</dt>
            <dd className="text-ink">{g.places.map((name, i) => <span key={name} className="inline-block">{i > 0 && <span aria-hidden="true" className="mx-1">·</span>}{name}</span>)}</dd>
          </div>)}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">방문 권역을 둥글게 표시한 안내도입니다.</p>
      </div>
    </div>
    <figcaption className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
      방문 지역 안내도 · 지도 경계: 통계청 2018 / <a href="https://github.com/southkorea/southkorea-maps" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Team POPONG</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">CC BY 4.0</a>) · 일산한의원 방문 권역에 맞춰 재구성
    </figcaption>
  </figure>;
}
