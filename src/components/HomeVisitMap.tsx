import { CLINIC } from "@/lib/clinic";
import map from "@/lib/home-visit-map.json";

const GYEONGGI = ["고양시", "파주시", "김포시", "양주시", "동두천시", "연천군", "포천시", "의정부시", "가평군", "남양주시", "구리시", "양평군", "하남시", "광주시", "여주시", "이천시", "성남시", "과천시", "안양시", "군포시", "의왕시", "수원시", "용인시", "안성시", "평택시", "화성시", "오산시", "안산시", "시흥시", "광명시", "부천시"];
const SEOUL = ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"];

function project(lon: number, lat: number) {
  const p = map.projection;
  return [p.left + (lon - p.minx) * p.cos * p.scale, p.top + (p.maxy - lat) * p.scale];
}

const LABELS: [string, number, number][] = [
  ["연천", 127.07, 38.10], ["포천", 127.26, 37.90],
  ["파주", 126.88, 37.98], ["가평", 127.51, 37.82],
  ["양평", 127.57, 37.49], ["여주", 127.64, 37.27],
  ["수원", 127.01, 37.27], ["용인", 127.24, 37.18],
  ["평택", 127.03, 37.01], ["안성", 127.30, 37.03],
];

export default function HomeVisitMap() {
  const [x, y] = project(CLINIC.geo.longitude, CLINIC.geo.latitude);
  const [seoulX, seoulY] = project(126.99, 37.55);
  const [provinceX, provinceY] = project(127.30, 37.48);
  return <figure className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-line bg-[var(--bg)]">
    <div className="grid lg:grid-cols-[1.35fr_1fr]">
      <div className="bg-[#f0f5f3]">
        <svg viewBox="0 0 640 640" role="img" aria-labelledby="visit-map-title visit-map-desc" className="block h-auto w-full">
          <title id="visit-map-title">풍산역 일산한의원에서 출발하는 서울·경기도 방문진료 지역</title>
          <desc id="visit-map-desc">서울특별시와 경기도 전 지역을 색으로 표시한 지도입니다. 출발점은 경기도 고양시 일산동구 풍산역·이마트 풍산점의 일산한의원입니다. 점선은 방문 방향을 나타냅니다.</desc>
          <defs>
            <clipPath id="visit-map-clip"><rect width="640" height="640" /></clipPath>
            <marker id="visit-map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="none" stroke="#367365" strokeWidth="1.5" /></marker>
          </defs>
          <g clipPath="url(#visit-map-clip)" strokeLinejoin="round">
            <path d={map.paths.Incheon} fill="#e2e7e5" stroke="#cbd5d0" strokeWidth="1" />
            <path d={map.paths["Gyeonggi-do"]} fill="#c1d8cd" stroke="#719b87" strokeWidth="1.4" fillRule="evenodd" />
            <path d={map.paths.Seoul} fill="#659a85" stroke="#fff" strokeWidth="2" />
            {[[127.13, 38.15], [127.65, 37.58], [127.38, 37.06]].map(([lon, lat]) => {
              const [endX, endY] = project(lon, lat);
              return <path key={lon} d={`M${x},${y} Q${(x + endX) / 2 - 30},${(y + endY) / 2 - 25} ${endX},${endY}`} fill="none" stroke="#367365" strokeWidth="1.8" strokeDasharray="5 7" opacity=".65" markerEnd="url(#visit-map-arrow)" />;
            })}
            {LABELS.map(([label, lon, lat]) => {
              const [lx, ly] = project(lon, lat);
              return <text key={label} x={lx} y={ly} textAnchor="middle" fontSize="18" fill="#355449" paintOrder="stroke" stroke="#c1d8cd" strokeWidth="4">{label}</text>;
            })}
            <text x={provinceX} y={provinceY} textAnchor="middle" fontSize="28" fontWeight="700" fill="#244f40">경기도</text>
            <text x={seoulX} y={seoulY} textAnchor="middle" fontSize="25" fontWeight="700" fill="#fff">서울</text>
            <circle cx={x} cy={y} r="16" fill="#fff" opacity=".65" />
            <circle cx={x} cy={y} r="8" fill="#6b4226" stroke="#fff" strokeWidth="3" />
            <path d={`M${x},${y - 10} L170,240`} fill="none" stroke="#6b4226" strokeWidth="2" />
            <rect x="24" y="179" width="230" height="66" rx="12" fill="#fff" stroke="#d6c8b9" />
            <text x="42" y="205" fontSize="19" fontWeight="700" fill="#6b4226">출발 · 일산한의원</text>
            <text x="42" y="229" fontSize="16" fill="#5b655e">고양시 일산동구 · 풍산역</text>
            <g transform="translate(585 36)" fill="#566f63"><text x="0" y="0" textAnchor="middle" fontSize="16">N</text><path d="M0 10L-5 24L0 21L5 24Z" /><path d="M0 21V42" stroke="#566f63" /></g>
          </g>
        </svg>
      </div>
      <div className="p-6 md:p-8 lg:self-center">
        <p className="text-sm font-semibold text-primary">풍산역에서 출발합니다</p>
        <h3 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink">서울 25개 구,<br />경기도 31개 시·군</h3>
        <p className="mt-4 text-base leading-relaxed text-muted">서울·경기도 전 지역에서 방문진료를 신청하실 수 있습니다. 정확한 주소와 이동 시간, 당일 진료 일정을 확인해 방문 여부를 안내합니다.</p>
        <div className="mt-5 flex gap-5 text-sm text-ink">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#659a85]" />서울 전 지역</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#c1d8cd]" />경기도 전 지역</span>
        </div>
        <details className="mt-6 border-t border-line pt-4">
          <summary className="cursor-pointer font-semibold text-primary">서울 방문 지역 모두 보기</summary>
          <p className="mt-3 text-sm leading-[1.9] text-muted">{SEOUL.join(" · ")}</p>
        </details>
        <details className="mt-4 border-t border-line pt-4">
          <summary className="cursor-pointer font-semibold text-primary">경기도 방문 지역 모두 보기</summary>
          <p className="mt-3 text-sm leading-[1.9] text-muted">{GYEONGGI.join(" · ")}</p>
        </details>
      </div>
    </div>
    <figcaption className="border-t border-line px-5 py-3 text-xs leading-relaxed text-muted">
      방문 지역 안내도 · 지도 경계: 통계청 2018 / <a href="https://github.com/southkorea/southkorea-maps" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Team POPONG</a> (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">CC BY 4.0</a>) · 일산한의원 방문 지역에 맞춰 재구성
    </figcaption>
  </figure>;
}
