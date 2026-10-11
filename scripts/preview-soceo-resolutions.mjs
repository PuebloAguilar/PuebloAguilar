import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
import {createAscii,renderAscii} from './ascii.mjs';
import {renderProfile} from './render-profile.mjs';

const directory='evidence/ascii-options/soceo';
const resolutions=[30,40,50,60,80,100];
const source=await readFile('assets/soceo-symbol.png');
const usage=JSON.parse(await readFile('data/usage.json','utf8'));
await mkdir(directory,{recursive:true});

for(const columns of resolutions){
  const path=`${directory}/resolution-${columns}`;
  await mkdir(path,{recursive:true});
  const art=await createAscii(source,{columns,kind:'color'});
  for(const dark of [true,false])for(const mobile of [false,true]){
    const svg=renderProfile(usage,art,{dark,mobile});
    const filename=`${path}/profile-${dark?'dark':'light'}${mobile?'-mobile':''}.svg`;
    await writeFile(filename,svg);
    if(dark&&!mobile)await sharp(Buffer.from(svg)).png().toFile(`${path}/profile.png`);
  }
  const portrait=`<svg xmlns="http://www.w3.org/2000/svg" width="448" height="448" viewBox="0 0 448 448"><rect width="448" height="448" rx="16" fill="#161b22"/>${renderAscii(art,{x:20,y:20})}</svg>`;
  await writeFile(`${path}/portrait.svg`,portrait);
  await sharp(Buffer.from(portrait)).png().toFile(`${path}/portrait.png`);
  await writeFile(`${path}/portrait.txt`,art.txt);
}

const cards=resolutions.map(columns=>`<article><h2>${columns} colunas</h2><p class="count">${columns} × ${columns*.6} caracteres</p><a class="preview" href="resolution-${columns}/profile-dark.svg" target="_blank"><img src="resolution-${columns}/portrait.svg" alt="Símbolo do SOCEO em ASCII com ${columns} colunas"></a><a class="name" href="https://www.instagram.com/puebloaguilar/" target="_blank" rel="noopener">PUEBLO AGUILAR</a><a class="website" href="https://www.soceo.ai/" target="_blank" rel="noopener">SOCEO.AI</a><a class="full" href="resolution-${columns}/profile-dark.svg" target="_blank">Ver painel completo ↗</a></article>`).join('');
await writeFile(`${directory}/resolutions.html`,`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SOCEO em ASCII — escolha a resolução</title><style>*{box-sizing:border-box}body{margin:0;background:#0d1117;color:#c9d1d9;font-family:ui-monospace,Menlo,monospace;padding:32px}h1{font-size:24px;margin:0 0 12px}header p{max-width:1000px;color:#8b949e;line-height:1.6;font-size:14px}.grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-top:28px}article{border:1px solid #30363d;border-radius:14px;padding:14px;background:#161b22}h2{font-size:18px;color:#9c6bff;margin:0 0 12px}.count{font-size:12px;color:#8b949e;margin:0 0 18px}img{width:100%;aspect-ratio:1;display:block}.name,.website{display:block;text-align:center;color:#a5d6ff;line-height:1.7;font-size:13px}.name{margin-top:12px;font-weight:700}.full{color:#a5d6ff;display:block;margin-top:20px;font-size:12px;text-decoration:none;line-height:1.5}a:hover{color:#fff}footer{font-size:12px;color:#758396;margin:26px 0;line-height:1.6}footer a{color:#a5d6ff}@media(max-width:1350px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){body{padding:18px}.grid{grid-template-columns:1fr}}</style><header><h1>O símbolo do SOCEO, em seis resoluções</h1><p>Mesmo símbolo quadrado e mesmas cores, com diferentes quantidades de caracteres.<br><strong>PUEBLO AGUILAR</strong> abre o Instagram; <strong>SOCEO.AI</strong> abre o site. Clique na imagem para ver o painel completo.</p></header><main class="grid">${cards}</main><footer>30 → 100 colunas: de caracteres maiores a um símbolo mais definido.<br><a href="../resolutions.html">Comparar também as resoluções da foto anterior ↗</a></footer></html>`);
console.log(`Prepared SOCEO symbol at ${resolutions.join(', ')} columns, with independent name and website links.`);
