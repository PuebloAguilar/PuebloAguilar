import {renderAscii} from './ascii.mjs';

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[character]));
}

const number=value=>new Intl.NumberFormat('en-US').format(value);
const compact=value=>value>=1e9?`${(value/1e9).toFixed(2)}B`:value>=1e6?`${(value/1e6).toFixed(2)}M`:number(value);

export function collectionTime(value) {
  return `${new Intl.DateTimeFormat('en-GB',{timeZone:'America/Sao_Paulo',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value)).replace(',','')} BRT`;
}

export function renderProfile(usage, art, {dark=true,mobile=false}={}) {
  const theme=dark?{bg:'#161b22',fg:'#c9d1d9',key:'#ffa657',value:'#a5d6ff',muted:'#758396',accent:'#3fb950'}:{bg:'#f6f8fa',fg:'#24292f',key:'#953800',value:'#0550ae',muted:'#6e7781',accent:'#1a7f37'};
  const width=mobile?700:1180;
  const height=mobile?1200:638;
  const textX=mobile?26:450;
  const textY=mobile?580:38;
  const textWidth=width-textX-28;
  const fontSize=mobile?16.5:16.5;
  const characterWidth=9.9;
  const capacity=Math.floor(textWidth/characterWidth);
  const rowHeight=24;
  const text=(x,y,value,fill=theme.fg,size=fontSize)=>`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}">${escapeXml(value)}</text>`;
  const heading=(row,title)=>text(textX,textY+row*rowHeight,`${title} ${'─'.repeat(Math.max(1,capacity-title.length-1))}`);
  const line=(row,key,value)=>{
    const dots='.'.repeat(Math.max(2,capacity-key.length-value.length-6));
    return `<text x="${textX}" y="${textY+row*rowHeight}"><tspan fill="${theme.muted}">. </tspan><tspan fill="${theme.key}">${escapeXml(key)}</tspan><tspan fill="${theme.fg}">:</tspan><tspan fill="${theme.muted}"> ${dots} </tspan><tspan fill="${theme.value}">${escapeXml(value)}</tspan></text>`;
  };
  const pair=(row,leftKey,leftValue,rightKey,rightValue)=>line(row,leftKey,`${leftValue}  |  ${rightKey}: ${rightValue}`);
  const all=usage.all,week=usage.week;
  const portraitX=mobile?125:26;
  const portraitY=mobile?30:105;
  const portraitSize=mobile?450:408;
  const content=[
    dark?'':`<rect x="${portraitX}" y="${portraitY}" width="${portraitSize}" height="${portraitSize}" fill="#161b22"/>`,
    renderAscii(art,{x:portraitX,y:portraitY,size:portraitSize}),
    text(mobile?275:142,mobile?523:538,'Pueblo Aguilar',theme.fg,17),
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
    text(textX,textY+23*rowHeight,'Tokens include cache. Activity includes subagents.',theme.muted,13),
    text(textX,textY+24*rowHeight,`Lifetime: ${all.startDate} → ${all.endDate} · refreshed hourly`,theme.muted,12.5),
  ].join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">\n<title id="title">Pueblo Aguilar — profile and AI usage</title>\n<desc id="description">ASCII rendering of the original GitHub profile photo of Pueblo Aguilar, Founder and CMO. Lifetime AI usage: ${all.totalTokens} tokens, ${all.messages} messages, ${all.sessions} sessions. Collected ${escapeXml(collectionTime(usage.updatedAt))}.</desc>\n<rect width="${width}" height="${height}" rx="15" fill="${theme.bg}"/>\n<g font-family="Menlo,Consolas,DejaVu Sans Mono,monospace" font-weight="600" font-size="${fontSize}" xml:space="preserve">\n${content}\n</g>\n</svg>\n`;
}

export function renderReadme(usage) {
  const all=usage.all;
  return `<a href="https://www.puebloaguilar.com/">\n  <picture>\n    <source media="(prefers-color-scheme: dark) and (max-width: 680px)" srcset="assets/profile-dark-mobile.svg">\n    <source media="(max-width: 680px)" srcset="assets/profile-light-mobile.svg">\n    <source media="(prefers-color-scheme: dark)" srcset="assets/profile-dark.svg">\n    <img alt="Pueblo Aguilar — Founder & CMO, building SOCEO and Houtines. ${number(all.totalTokens)} AI tokens, ${number(all.messages)} messages and ${number(all.sessions)} sessions. Last collection: ${collectionTime(usage.updatedAt)}." src="assets/profile-light.svg" width="1180">\n  </picture>\n</a>\n\n<p align="center">\n  <a href="https://soceo.ai/">SOCEO</a> ·\n  <a href="https://houtines.com/">Houtines</a> ·\n  <a href="https://www.puebloaguilar.com/">Website & AI dashboard</a> ·\n  <a href="https://instagram.com/puebloaguilar">Instagram</a> ·\n  <a href="https://linkedin.com/in/opueblo">LinkedIn</a>\n</p>\n\n<details>\n<summary>About the AI metrics</summary>\n\nThese are recorded usage totals, including cache tokens and subagent activity. Sessions are distinct recorded sessions, not sums of daily counts. The panel shows lifetime totals from **${all.startDate} to ${all.endDate}**, plus the last seven days.\n\nThe collection timestamp comes from the source data. An hourly refresh keeps the latest valid snapshot; temporary source failures preserve the last collection. The hourly publisher runs while its host Mac is awake. The checked-in GitHub Actions template can be enabled when workflow access is available.\n\nPublic sources: [Pueblo's AI usage](https://www.puebloaguilar.com/api/ai-usage) and [SOCEO's shared snapshot](https://soceo.ai/data/pueblo-ai-usage.json). Only aggregate counters are stored in this repository.\n\nVisual direction: [Andrew6rant's profile](https://github.com/Andrew6rant). Original SVG implementation; see [.references/README.md](.references/README.md) for research and licenses.\n\n</details>\n`;
}
