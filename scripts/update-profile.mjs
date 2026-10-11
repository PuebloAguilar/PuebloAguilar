import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createAscii} from './ascii.mjs';
import {loadSnapshot} from './usage.mjs';
import {renderProfile,renderReadme} from './render-profile.mjs';

const urls=['https://www.puebloaguilar.com/api/ai-usage','https://soceo.ai/data/pueblo-ai-usage.json'];
let cached;
try {cached=JSON.parse(await readFile('data/usage.json','utf8'));} catch { /* Initial collection. */ }
const usage=await loadSnapshot({urls,cached});
const source=await readFile('assets/soceo-symbol.png');
const art=await createAscii(source,{columns:80,kind:'color'});
await mkdir('data',{recursive:true});
for(const dark of [true,false])for(const mobile of [false,true]){
  const name=`assets/profile-${dark?'dark':'light'}${mobile?'-mobile':''}.svg`;
  await writeFile(name,renderProfile(usage,art,{dark,mobile}));
}
for(const dark of [true,false])for(const part of ['symbol','metrics']){
  const name=`assets/profile-${part}-${dark?'dark':'light'}.svg`;
  await writeFile(name,renderProfile(usage,art,{dark,part}));
  if(part==='metrics')await writeFile(`assets/profile-metrics-${dark?'dark':'light'}-mobile.svg`,renderProfile(usage,art,{dark,mobile:true,part}));
}
await writeFile('data/usage.json',`${JSON.stringify(usage,null,2)}\n`);
await writeFile('README.md',renderReadme(usage));
console.log(`Profile generated from public collection ${usage.updatedAt}`);
