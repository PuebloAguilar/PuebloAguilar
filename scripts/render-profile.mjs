import {renderAscii} from './ascii.mjs';

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]));
}

const number=value=>new Intl.NumberFormat('en-US').format(value);
const compact=value=>value>=1e9?`${(value/1e9).toFixed(2)}B`:value>=1e6?`${(value/1e6).toFixed(2)}M`:number(value);

export function collectionTime(value) {
  return `${new Intl.DateTimeFormat('en-GB',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value)).replace(',','')} BRT`;
}

export function renderProfile(usage, art, {dark=true,mobile=false,part='full'}={}) {
  const theme=dark?{bg:'#161b22',fg:'#c9d1d9',key:'#9c6bff',value:'#a5d6ff',muted:'#758396',accent:'#3fb950'}:{bg:'#f6f8fa',fg:'#24292f',key:'#7839ee',value:'#0550ae',muted:'#6e7781',accent:'#1a7f37'};
  const symbolOnly=part==='symbol',metricsOnly=part==='metrics';
  const width=symbolOnly?448:metricsOnly?(mobile?560:756):mobile?700:1180;
  let height=symbolOnly?448:metricsOnly?638:mobile?1200:638;
  const textX=metricsOnly?26:mobile?26:450;
  const textY=metricsOnly?38:mobile?580:38;
  const textWidth=width-textX-28;
  const fontSize=metricsOnly&&mobile?20:16.5;
  const characterWidth=fontSize*.6;
  const capacity=Math.floor(textWidth/characterWidth);
  const rowHeight=metricsOnly&&mobile?30:24;
  let extraRows=0;
  const text=(x,y,value,fill=theme.fg,size=fontSize)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}">${escapeXml(value)}</text>`;
  const heading=(row,title)=>text(textX,textY+(row+extraRows)*rowHeight,`${title} ${'─'.repeat(Math.max(1,capacity-title.length-1))}`);
  const line=(row,key,value)=>{
    if(metricsOnly&&mobile&&key.length+value.length+6>capacity){
      const y=textY+(row+extraRows)*rowHeight;
      extraRows++;
      return `<text x="${textX}" y="${y}"><tspan fill="${theme.key}">${escapeXml(key)}</tspan><tspan fill="${theme.fg}">:</tspan></text>${text(textX+12,y+rowHeight,value,theme.value)}`;
    }
    const dots='.'.repeat(Math.max(2,capacity-key.length-value.length-6));
    return `<text x="${textX}" y="${textY+(row+extraRows)*rowHeight}"><tspan fill="${theme.muted}">. </tspan><tspan fill="${theme.key}">${escapeXml(key)}</tspan><tspan fill="${theme.fg}">:</tspan><tspan fill="${theme.muted}"> ${dots} </tspan><tspan fill="${theme.value}">${escapeXml(value)}</tspan></text>`;
  };
  const pair=(row,leftKey,leftValue,rightKey,rightValue)=>line(row,leftKey,`${leftValue}  |  ${rightKey}: ${rightValue}`);
  const all=usage.all,week=usage.week;
  const portraitX=symbolOnly?20:mobile?125:26;
  const portraitY=symbolOnly?20:mobile?30:105;
  const portraitSize=symbolOnly?408:mobile?450:408;
  const center=portraitX+portraitSize/2;
  const nameY=mobile?523:538;
  const portrait=[
    dark||symbolOnly?'':`<rect x="${portraitX}" y="${portraitY}" width="${portraitSize}" height="${portraitSize}" fill="#161b22"/>`,
    renderAscii(art,{x:portraitX,y:portraitY,size:portraitSize}),
    ...(symbolOnly?[]:[
      `<a href="https://www.instagram.com/puebloaguilar/"><text x="${center}" y="${nameY}" text-anchor="middle" fill="${theme.value}" font-size="17" text-decoration="underline">PUEBLO AGUILAR</text></a>`,
      `<a href="https://www.soceo.ai/"><text x="${center}" y="${nameY+28}" text-anchor="middle" fill="${theme.value}" font-size="17" text-decoration="underline">SOCEO.AI</text></a>`,
    ]),
  ];
  const metrics=[
    heading(0,'pueblo@aguilar'),
    line(1,'OS','macOS'),
    line(2,'Role','Founder & CMO'),
    line(3,'Building','SOCEO, Houtines'),
    line(4,'Focus','AI agents, autonomous systems'),
    line(5,'Stack','TypeScript, Python, React'),
    line(7,'Agents','Codex, Claude Code, Hermes'),
    heading(9,'- Contact'),
    line(10,'Website','puebloaguilar.com'),
    line(11,'Instagram','@puebloaguilar'),
    line(12,'LinkedIn','/in/opueblo'),
    heading(14,'- AI Usage'),
    line(15,'Tokens.All',compact(all.totalTokens)),
    pair(16,'Input',compact(all.inputTokens),'Output',compact(all.outputTokens)),
    line(17,'Cache',compact(all.cacheReadTokens+all.cacheCreationTokens)),
    pair(18,'Sessions',number(all.sessions),'Tool calls',number(all.toolCalls)),
    pair(19,'Messages',number(all.messages),'Active days',number(all.activeDays)),
    pair(20,'Tokens.7d',compact(week.totalTokens),'Messages.7d',number(week.messages)),
    line(22,'Collected',collectionTime(usage.updatedAt)),
    text(textX,textY+(23+extraRows)*rowHeight,'Tokens include cache. Activity includes subagents.',theme.muted,13),
    text(textX,textY+(24+extraRows)*rowHeight,`Lifetime: ${all.startDate} → ${all.endDate} · refreshed hourly`,theme.muted,12.5),
  ];
  const content=(symbolOnly?portrait:metricsOnly?metrics:[...portrait,...metrics]).join('\n');
  if(metricsOnly&&mobile)height=textY+(25+extraRows)*rowHeight+24;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">\n<title id="title">Pueblo Aguilar — profile and AI usage</title>\n<desc id="description">ASCII rendering of the SOCEO symbol for Pueblo Aguilar, Founder and CMO. Lifetime AI usage: ${all.totalTokens} tokens, ${all.messages} messages, ${all.sessions} sessions. Collected ${escapeXml(collectionTime(usage.updatedAt))}.</desc>\n<rect width="${width}" height="${height}" rx="15" fill="${symbolOnly?'#161b22':theme.bg}"/>\n<g font-family="Menlo,Consolas,DejaVu Sans Mono,monospace" font-weight="600" font-size="${fontSize}" xml:space="preserve">\n${content}\n</g>\n</svg>\n`;
}

export function renderReadme(usage) {
  const all=usage.all;
  const picture=(prefix,alt,width,{mobile=false}={})=>`<picture>${mobile?`<source media="(prefers-color-scheme: dark) and (max-width: 680px)" srcset="assets/profile-${prefix}-dark-mobile.svg"><source media="(max-width: 680px)" srcset="assets/profile-${prefix}-light-mobile.svg">`:''}
    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-${prefix}-dark.svg">
    <img alt="${escapeXml(alt)}" src="assets/profile-${prefix}-light.svg" width="${width}">
  </picture>`;
  return `<table width="100%">
  <tr>
    <td width="37%" align="center" valign="middle">
      ${picture('symbol','SOCEO symbol in ASCII, 80 columns × 48 rows',448)}
      <br>
      <a href="https://www.instagram.com/puebloaguilar/"><strong>PUEBLO AGUILAR</strong></a>
      <br>
      <a href="https://www.soceo.ai/"><strong>SOCEO.AI</strong></a>
    </td>
    <td width="63%" valign="middle">
      ${picture('metrics',`Pueblo Aguilar — Founder & CMO, building SOCEO and Houtines. ${number(all.totalTokens)} AI tokens, ${number(all.messages)} messages and ${number(all.sessions)} sessions. Last collection: ${collectionTime(usage.updatedAt)}.`,756,{mobile:true})}
    </td>
  </tr>
</table>\n\n<p align="center">\n  <a href="https://soceo.ai/">SOCEO</a> ·\n  <a href="https://houtines.com/">Houtines</a> ·\n  <a href="https://www.puebloaguilar.com/">Website & AI dashboard</a> ·\n  <a href="https://instagram.com/puebloaguilar">Instagram</a> ·\n  <a href="https://linkedin.com/in/opueblo">LinkedIn</a>\n</p>\n\n<details>\n<summary>About the AI metrics</summary>\n\nThese are recorded usage totals, including cache tokens and subagent activity. Sessions are distinct recorded sessions, not sums of daily counts. The panel shows lifetime totals from **${all.startDate} to ${all.endDate}**, plus the last seven days.\n\nThe collection timestamp comes from the source data. An hourly refresh keeps the latest valid snapshot; temporary source failures preserve the last collection. The hourly publisher runs while its host Mac is awake. The checked-in GitHub Actions template can be enabled when workflow access is available.\n\nPublic sources: [Pueblo's AI usage](https://www.puebloaguilar.com/api/ai-usage) and [SOCEO's shared snapshot](https://soceo.ai/data/pueblo-ai-usage.json). Only aggregate counters are stored in this repository.\n\nVisual direction: [Andrew6rant's profile](https://github.com/Andrew6rant). Original SVG implementation; see [.references/README.md](.references/README.md) for research and licenses.\n\n</details>\n`;
}
