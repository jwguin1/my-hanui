// KOSTAT SGIS 2018 municipal boundaries, public data licensed under KOGL Type 1.
// Rebuild: node scripts/build-home-visit-map.mjs [downloaded GeoJSON path]
import fs from 'node:fs/promises';
const sourceUrl='https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-municipalities-2018-geo.json';
const data=process.argv[2]?JSON.parse(await fs.readFile(process.argv[2],'utf8')):await (await fetch(sourceUrl)).json();
const project=([lon,lat])=>[70+(lon-126.56)*1040*Math.cos(37.8*Math.PI/180),54+(38.07-lat)*1040];
function simplify(points,tolerance){
 const first=points[0],last=points.at(-1);let farthest=0,index=0;
 for(let i=1;i<points.length-1;i++){const p=points[i],dx=last[0]-first[0],dy=last[1]-first[1],length=dx*dx+dy*dy;const t=length?Math.max(0,Math.min(1,((p[0]-first[0])*dx+(p[1]-first[1])*dy)/length)):0;const distance=(p[0]-first[0]-t*dx)**2+(p[1]-first[1]-t*dy)**2;if(distance>farthest){farthest=distance;index=i;}}
 if(farthest<=tolerance*tolerance)return [first,last];
 return [...simplify(points.slice(0,index+1),tolerance).slice(0,-1),...simplify(points.slice(index),tolerance)];
}
const paths=data.features.filter(f=>{
 const points=f.geometry.coordinates.flat(f.geometry.type==='MultiPolygon'?2:1);
 return points.some(([x,y])=>x>=126.50&&x<=127.16&&y>=37.48&&y<=38.12);
}).map(f=>({name:f.properties.name,service:f.properties.name==='파주시'||f.properties.name.startsWith('고양시'),d:(f.geometry.type==='MultiPolygon'?f.geometry.coordinates:[f.geometry.coordinates]).flatMap(polygon=>polygon.map(ring=>simplify(ring.map(project),0.7).map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(1)).join(',')).join('')+'Z')).join('')}));
const [x,y]=project([126.7871254,37.6738501]);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="680" viewBox="0 0 640 680" role="img" aria-labelledby="title desc">
<title id="title">고양시·파주시 방문진료 지도</title><desc id="desc">파주시와 고양시의 실제 행정구역 경계를 색으로 표시했습니다. 고양시는 일산서구·일산동구·덕양구를 포함합니다. 출발점은 일산동구 풍산역의 일산한의원입니다. 주변 회색 지역은 방문 대상 지역에 포함되지 않습니다.</desc>
<metadata>Source: KOSTAT SGIS 2018, via southkorea/southkorea-maps. KOGL Type 1. ${sourceUrl} — projected to a local equirectangular view, styled for home-visit coverage.</metadata>
<defs><clipPath id="frame"><rect width="640" height="680" rx="18"/></clipPath></defs>
<g clip-path="url(#frame)" stroke-linejoin="round"><rect width="640" height="680" fill="#f4f6f3"/>
${paths.filter(p=>!p.service).map(p=>`<path d="${p.d}" fill="#e4e8e3" stroke="#c9d2c9" stroke-width="1.2" fill-rule="evenodd"/>`).join('\n')}
${paths.filter(p=>p.service).map(p=>`<path d="${p.d}" fill="${p.name==='파주시'?'#cde3cf':'#8bc0aa'}" stroke="#2c6d56" stroke-width="2" fill-rule="evenodd"/>`).join('\n')}
<g font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" text-anchor="middle">
<text x="300" y="285" font-size="48" font-weight="700" fill="#234e39">파주시</text>
<text x="340" y="520" font-size="48" font-weight="700" fill="#163f32">고양시</text>
<g font-size="26" fill="#6e7d73"><text x="505" y="300">양주시</text><text x="86" y="450">김포시</text><text x="524" y="590">서울</text></g>
<g transform="translate(588 36)" fill="#617166"><text font-size="22">N</text><path d="M0 12L-7 30L0 26L7 30Z"/><path d="M0 26V48" stroke="#617166" stroke-width="2"/></g>
<path d="M${x.toFixed(1)},${y.toFixed(1)}L190,577" stroke="#704a2b" stroke-width="2.5" fill="none"/>
<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="#fff"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#704a2b"/>
<rect x="20" y="577" width="340" height="90" rx="14" fill="#fff" stroke="#d6c7b7" stroke-width="1.5"/>
<text x="190" y="613" font-size="34" font-weight="700" fill="#704a2b">출발 · 일산한의원</text><text x="190" y="651" font-size="34" fill="#59695e">일산동구 풍산역</text>
</g></g></svg>`;
await fs.mkdir('public/images',{recursive:true});await fs.writeFile('public/images/home-visit-goyang-paju.svg',svg);
console.log({output:'public/images/home-visit-goyang-paju.svg',areas:paths.filter(p=>p.service).map(p=>p.name),bytes:Buffer.byteLength(svg)});
