import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createAscii} from './ascii.mjs';
import {loadSnapshot,selectSnapshot} from './usage.mjs';
import {renderProfile,renderReadme} from './render-profile.mjs';

const urls=['https://www.puebloaguilar.com/api/ai-usage','https://soceo.ai/data/pueblo-ai-usage.json'];
let cached;
try {cached=JSON.parse(await readFile('data/usage.json','utf8'));} catch { /* Initial collection. */ }
if(process.argv[2]==='--pin-readme'){
  const commit=process.argv[3];
  if(!/^[a-f0-9]{40}$/.test(commit??''))throw new Error('Expected an immutable asset commit');
  await writeFile('README.md',renderReadme(selectSnapshot([],cached),{assetBase:`https://raw.githubusercontent.com/PuebloAguilar/PuebloAguilar/${commit}/assets/`}));
}else{
const snapshot=process.env.AI_USAGE_SOURCE_FILE?JSON.parse(await readFile(process.env.AI_USAGE_SOURCE_FILE,'utf8')):undefined;
const usage=await loadSnapshot({urls,cached,snapshot});
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
if(!process.argv.includes('--no-readme'))await writeFile('README.md',renderReadme(usage));
console.log(`Profile generated from public collection ${usage.updatedAt}`);
}
