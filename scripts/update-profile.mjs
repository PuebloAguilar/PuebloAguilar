import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createAscii} from './ascii.mjs';
import {loadSnapshot} from './usage.mjs';
import {renderProfile,renderReadme} from './render-profile.mjs';

const urls=['https://www.puebloaguilar.com/api/ai-usage','https://soceo.ai/data/pueblo-ai-usage.json'];
let cached;
try {cached=JSON.parse(await readFile('data/usage.json','utf8'));} catch { /* Initial collection. */ }
const usage=await loadSnapshot({urls,cached});
const avatar=await readFile('assets/avatar.jpg');
const art=await createAscii(avatar,{columns:50,kind:'gray'});
await mkdir('data',{recursive:true});
for(const dark of [true,false])for(const mobile of [false,true]){
  const name=`assets/profile-${dark?'dark':'light'}${mobile?'-mobile':''}.svg`;
  await writeFile(name,renderProfile(usage,art,{dark,mobile}));
}
await writeFile('data/usage.json',`${JSON.stringify(usage,null,2)}\n`);
await writeFile('README.md',renderReadme(usage));
console.log(`Profile generated from public collection ${usage.updatedAt}`);
