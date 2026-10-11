import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createAscii,renderAscii} from './ascii.mjs';
import {escapeXml,renderProfile} from './render-profile.mjs';

const directory=process.env.ASCII_PREVIEW_DIRECTORY??'evidence/ascii-options';
await mkdir(directory,{recursive:true});
const usage=JSON.parse(await readFile('data/usage.json','utf8'));
const avatar=await readFile('assets/avatar.jpg');
const columns=Number(process.env.ASCII_PREVIEW_COLUMNS??100);
if(![30,40,50,60,80,100].includes(columns))throw new Error('Unsupported ASCII preview resolution');
const metadata=await sharp(avatar).metadata();
if(metadata.width!==metadata.height)throw new Error('Expected the original square GitHub avatar');
const allStyles=[
  {id:'01',name:'Clássico',description:'Caracteres claros, retrato monocromático como na referência.',kind:'classic'},
  {id:'02',name:'Mais detalhe',description:'Tons de cinza por caractere para preservar óculos, rosto e boné.',kind:'gray'},
  {id:'03',name:'Azul de terminal',description:'Retrato em caracteres azuis, com luz e sombra da foto.',kind:'blue'},
  {id:'04',name:'Cores da foto',description:'Cada caractere mantém a cor original do seu rosto e da roupa.',kind:'color'},
];
const styles=process.env.ASCII_PREVIEW_STYLE?allStyles.filter(style=>style.id===process.env.ASCII_PREVIEW_STYLE):allStyles;
if(!styles.length)throw new Error('Unknown ASCII preview style');
for(const style of styles){
  const art=await createAscii(avatar,{columns,kind:style.kind});
  const profile=renderProfile(usage,art);
  await writeFile(`${directory}/profile-${style.id}.svg`,profile);
  await sharp(Buffer.from(profile)).png().toFile(`${directory}/profile-${style.id}.png`);
  const portrait=`<svg xmlns="http://www.w3.org/2000/svg" width="448" height="448" viewBox="0 0 448 448"><rect width="448" height="448" rx="16" fill="#161b22"/>${renderAscii(art,{x:20,y:20})}</svg>`;
  await writeFile(`${directory}/portrait-${style.id}.svg`,portrait);
  await sharp(Buffer.from(portrait)).png().toFile(`${directory}/portrait-${style.id}.png`);
  await writeFile(`${directory}/portrait-${style.id}.txt`,art.txt);
}
const cards=styles.map(s=>`<article><h2>${s.id} · ${escapeXml(s.name)}</h2><p>${escapeXml(s.description)}</p><a href="profile-${s.id}.svg?view=square" target="_blank"><img src="portrait-${s.id}.svg?view=square" alt="Sua foto em ASCII: ${escapeXml(s.name)}"></a><a class="full" href="profile-${s.id}.svg?view=square" target="_blank">Ver no perfil completo ↗</a></article>`).join('');
await writeFile(`${directory}/index.html`,`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Escolha seu retrato em ASCII</title><style>*{box-sizing:border-box}body{margin:0;background:#0d1117;color:#c9d1d9;font-family:ui-monospace,Menlo,monospace;padding:34px}h1{font-size:24px;margin:0 0 12px}header p{max-width:880px;color:#8b949e;line-height:1.6}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;margin-top:28px}article{border:1px solid #30363d;border-radius:16px;padding:16px;background:#161b22}h2{font-size:17px;color:#ffa657;margin:0 0 10px}article p{font-size:13px;line-height:1.6;min-height:64px;color:#8b949e}img{width:100%;height:auto;display:block}.full{color:#a5d6ff;display:block;margin-top:14px;font-size:13px;text-decoration:none}a:hover{color:#fff}@media(max-width:1100px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:550px){body{padding:18px}.grid{grid-template-columns:1fr}}footer{font-size:12px;color:#758396;margin:28px 0}</style><header><h1>Sua foto de perfil, em ASCII</h1><p>Quatro versões quadradas feitas a partir da foto de perfil inteira, com as proporções preservadas. Clique em cada opção para comparar com o painel completo de métricas.</p></header><main class="grid">${cards}</main><footer>Prévia local para escolha. O perfil público ainda não foi alterado.</footer></html>`);
console.log(`Created ${styles.length} square ASCII options in ${directory}; entire ${metadata.width}×${metadata.height} avatar, rendered aspect 1.`);
