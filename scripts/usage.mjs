const TOKEN_KEYS = ['inputTokens','outputTokens','cacheCreationTokens','cacheReadTokens'];
const COUNT_KEYS = [...TOKEN_KEYS,'totalTokens','activeDays','messages','sessions','toolCalls'];

function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(value).toISOString().slice(0,10) !== value) throw new Error('Invalid collection date');
  return value;
}

function period(tokens, engagement) {
  if (!tokens || !engagement) throw new Error('Incomplete aggregate');
  const result = {startDate:date(tokens.startDate),endDate:date(tokens.endDate)};
  if (result.startDate > result.endDate) throw new Error('Invalid collection range');
  for (const key of COUNT_KEYS) {
    const value = ['messages','sessions','toolCalls'].includes(key) ? engagement[key] : tokens[key];
    if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid aggregate counter');
    result[key] = value;
  }
  if (TOKEN_KEYS.reduce((sum,key)=>sum+result[key],0) !== result.totalTokens) throw new Error('Inconsistent token totals');
  return result;
}

function summary(value) {
  if (value?.schemaVersion !== 1 || value.owner !== 'puebloaguilar' || typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))) throw new Error('Invalid public summary');
  if (Date.parse(value.updatedAt) > Date.now()+300000) throw new Error('Future collection timestamp');
  return {schemaVersion:1,owner:'puebloaguilar',updatedAt:value.updatedAt,all:period(value.all,value.all),week:period(value.week,value.week)};
}

export function summarize(feed) {
  if (feed?.schemaVersion !== 3 || feed.owner !== 'puebloaguilar') throw new Error('Invalid feed identity');
  return summary({schemaVersion:1,owner:feed.owner,updatedAt:feed.updatedAt,all:period(feed.periods?.all,feed.engagement?.periods?.all),week:period(feed.periods?.['7'],feed.engagement?.periods?.['7'])});
}

export function selectSnapshot(candidates, cached) {
  const valid=[];
  for (const candidate of [...candidates,cached]) {
    try { valid.push(summary(candidate)); } catch { /* Ignore incomplete snapshots. */ }
  }
  if (!valid.length) throw new Error('No valid public AI usage snapshot available');
  return valid.sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt))[0];
}

export async function loadSnapshot({urls,cached,fetchImpl=fetch}) {
  const results=await Promise.allSettled(urls.map(async url=>{
    const response=await fetchImpl(url,{signal:AbortSignal.timeout(15000),headers:{Accept:'application/json'}});
    if (!response.ok) throw new Error('Public feed unavailable');
    return summarize(await response.json());
  }));
  return selectSnapshot(results.filter(x=>x.status==='fulfilled').map(x=>x.value),cached);
}
