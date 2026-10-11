import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';

const directory='evidence/ascii-options';
const resolutions=[30,40,50,60,80,100];
const labels=['Bem simples','Simples','Equilibrada','Mais definida','Detalhada','02 original'];
for(const columns of resolutions){
  execFileSync(process.execPath,['scripts/preview-ascii.mjs'],{
    env:{...process.env,ASCII_PREVIEW_DIRECTORY:`${directory}/resolution-${columns}`,ASCII_PREVIEW_COLUMNS:String(columns),ASCII_PREVIEW_STYLE:'02'},
    stdio:'pipe',
  });
}
const cards=resolutions.map((columns,index)=>{
  const rows=columns*.6;
  const path=`resolution-${columns}`;
  return `<article><h2>${columns} colunas</h2><p class="kind">${labels[index]}</p><p class="count">${columns} × ${rows} caracteres</p><a href="${path}/profile-02.svg" target="_blank"><img src="${path}/portrait-02.svg" alt="Versão 02 com ${columns} colunas e ${rows} linhas"></a><a class="full" href="${path}/profile-02.svg" target="_blank">Ver no perfil completo ↗</a></article>`;
}).join('');
await writeFile(`${directory}/resolutions.html`,`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Versão 02 — diferentes resoluções</title><style>*{box-sizing:border-box}body{margin:0;background:#0d1117;color:#c9d1d9;font-family:ui-monospace,Menlo,monospace;padding:32px}h1{font-size:24px;margin:0 0 12px}header p{max-width:950px;color:#8b949e;line-height:1.6;font-size:14px}.grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:14px;margin-top:28px}article{border:1px solid #30363d;border-radius:14px;padding:14px;background:#161b22}h2{font-size:18px;color:#ffa657;margin:0 0 7px}.kind{font-size:13px;margin:0 0 7px}.count{font-size:12px;color:#8b949e;margin:0 0 18px}img{width:100%;aspect-ratio:1;height:auto;display:block}.full{color:#a5d6ff;display:block;margin-top:18px;font-size:12px;text-decoration:none;line-height:1.5}a:hover{color:#fff}footer{font-size:12px;color:#758396;margin:26px 0;line-height:1.6}@media(max-width:1350px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:500px){body{padding:18px}.grid{grid-template-columns:1fr}}</style><header><h1>A versão 02, com menos caracteres</h1><p>A mesma foto inteira, quadrada, nos mesmos tons de cinza. As imagens têm o mesmo tamanho na tela: muda só a quantidade de caracteres e o nível de detalhe. A última é a resolução da 02 anterior, para comparar.</p></header><main class="grid">${cards}</main><footer>30 → 100 colunas: de caracteres maiores e mais aparentes a um retrato mais definido.<br>Prévia local para escolher a resolução do seu perfil.</footer></html>`);

const tileSize=240,gap=16,padding=24;
const width=padding*2+resolutions.length*tileSize+(resolutions.length-1)*gap;
const height=320;
const background=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#0d1117"/>${resolutions.map((columns,i)=>`<text x="${padding+i*(tileSize+gap)}" y="26" fill="#ffa657" font-family="Menlo,monospace" font-size="18">${columns} colunas</text><text x="${padding+i*(tileSize+gap)}" y="306" fill="#8b949e" font-family="Menlo,monospace" font-size="13">${columns} × ${columns*.6} caracteres</text>`).join('')}</svg>`);
const layers=[];
for(const [i,columns] of resolutions.entries()){
  const buffer=await readFile(`${directory}/resolution-${columns}/portrait-02.png`);
  const input=await sharp(buffer).resize(tileSize,tileSize).png().toBuffer();
  layers.push({input,left:padding+i*(tileSize+gap),top:42});
}
await sharp(background).composite(layers).png().toFile(`${directory}/resolutions-overview.png`);
console.log(`Prepared style 02 at ${resolutions.join(', ')} columns; square image size and grayscale treatment preserved.`);
