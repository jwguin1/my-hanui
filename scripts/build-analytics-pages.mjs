import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
const paths=new Set();
function pages(dir,prefix=''){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.isDirectory()&&!/[\[(@]/.test(e.name)&&!['api','herbs'].includes(e.name))pages(path.join(dir,e.name),prefix+'/'+e.name);
  if(e.isFile()&&e.name==='page.tsx')paths.add(prefix||'/');
 }
}
pages('src/app');
for(const category of ['blog','pain','diet','skin','autonomic'])for(const f of fs.readdirSync('content/'+category).filter(f=>f.endsWith('.md'))){
 const {data}=matter(fs.readFileSync(`content/${category}/${f}`,'utf8'));
 if(data.published!==false&&data.status!=='under_review')paths.add(`/${category}/${data.slug||f.slice(0,-3)}`);
}
for(const a of JSON.parse(fs.readFileSync('src/data/research-articles.json','utf8')))if(a.status==='published')paths.add('/research/articles/'+a.slug);
for(const c of ['pain','diet','skin','digestive','korean'])paths.add('/research/category/'+c);
fs.writeFileSync('src/data/analytics-pages.json',JSON.stringify([...paths].sort(),null,2)+'\n');
console.log(`Analytics allowlist: ${paths.size} public pages; patient links excluded.`);
