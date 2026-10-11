import sharp from 'sharp';

const escape=value=>String(value).replace(/[&<>"']/g, character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]));

export async function createAscii(avatar,{columns=50,kind='gray'}={}) {
  if(![30,40,50,60,80,100].includes(columns))throw new Error('Unsupported ASCII resolution');
  if(!['classic','gray','blue','color'].includes(kind))throw new Error('Unknown ASCII style');
  const metadata=await sharp(avatar).metadata();
  if(metadata.width!==metadata.height)throw new Error('Expected the original square GitHub avatar');
  const rows=Math.round(columns*.6);
  const {data,info}=await sharp(avatar).resize(columns,rows,{fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const cells=[],lines=[];
  for(let row=0;row<rows;row++){
    let line='';
    for(let column=0;column<columns;column++){
      const index=(row*columns+column)*info.channels;
      const r=data[index],g=data[index+1],b=data[index+2];
      const luma=.2126*r+.7152*g+.0722*b;
      let character,fill;
      if(kind==='classic'){
        character=' .:-=+*#%@'[Math.round((255-luma)/255*9)];
        fill='#c9d1d9';
      }else{
        character='MW@%#&*+'[Math.min(7,Math.floor((255-luma)/256*8))];
        if(kind==='gray'){
          const value=Math.round(28+227*Math.sqrt(luma/255));
          fill=`rgb(${value},${value},${value})`;
        }else if(kind==='blue'){
          const value=Math.sqrt(luma/255);
          fill=`rgb(${Math.round(24+141*value)},${Math.round(38+176*value)},${Math.round(52+203*value)})`;
        }else fill=`rgb(${Math.round(255*(r/255)**.7)},${Math.round(255*(g/255)**.7)},${Math.round(255*(b/255)**.7)})`;
      }
      line+=character;
      if(character!==' ')cells.push({row,column,character,fill});
    }
    lines.push(line);
  }
  return {columns,rows,cells,txt:lines.join('\n')+'\n'};
}

export function renderAscii(art,{x=26,y=105,size=408}={}) {
  const fontSize=size/(art.columns*.6);
  const advance=fontSize*.6;
  const cells=art.cells.map(cell=>`<text x="${(x+cell.column*advance).toFixed(2)}" y="${(y+fontSize+cell.row*fontSize).toFixed(2)}" fill="${cell.fill}">${escape(cell.character)}</text>`).join('');
  return `<g font-family="Menlo,Consolas,DejaVu Sans Mono,monospace" font-size="${fontSize}" font-weight="700" xml:space="preserve">${cells}</g>`;
}
