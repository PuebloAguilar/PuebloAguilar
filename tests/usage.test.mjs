import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, selectSnapshot, loadSnapshot } from '../scripts/usage.mjs';

function feed(updatedAt = '2026-10-11T20:00:00.000Z') {
  const period = {startDate:'2026-10-05',endDate:'2026-10-11',inputTokens:10,outputTokens:20,cacheCreationTokens:30,cacheReadTokens:40,totalTokens:100,activeDays:7};
  const counts = {messages:12,sessions:3,toolCalls:8};
  return {schemaVersion:3,owner:'puebloaguilar',updatedAt,periods:{all:{...period,startDate:'2026-03-08'},7:{...period}},engagement:{periods:{all:{...counts},7:{...counts}}},secret:'never-publish',prompts:['never-publish'],sessions:[{content:'never-publish'}]};
}

test('publishes only public counters and preserves exact collection time', () => {
  const result = summarize(feed());
  assert.deepEqual(result,{schemaVersion:1,owner:'puebloaguilar',updatedAt:'2026-10-11T20:00:00.000Z',all:{startDate:'2026-03-08',endDate:'2026-10-11',inputTokens:10,outputTokens:20,cacheCreationTokens:30,cacheReadTokens:40,totalTokens:100,activeDays:7,messages:12,sessions:3,toolCalls:8},week:{startDate:'2026-10-05',endDate:'2026-10-11',inputTokens:10,outputTokens:20,cacheCreationTokens:30,cacheReadTokens:40,totalTokens:100,activeDays:7,messages:12,sessions:3,toolCalls:8}});
  assert.ok(!JSON.stringify(result).includes('never-publish'));
});

test('rejects foreign owners, inconsistent token totals and invalid counters', () => {
  for (const edit of [x=>x.owner='another-user',x=>x.schemaVersion=2,x=>x.updatedAt='invalid',x=>x.periods.all.totalTokens=101,x=>x.periods.all.inputTokens=-1,x=>x.engagement.periods.all.sessions=1.5]) {
    const value = feed(); edit(value);
    assert.throws(()=>summarize(value));
  }
});

test('does not invent engagement totals for an incomplete snapshot', () => {
  const value=feed();delete value.engagement;
  assert.throws(()=>summarize(value));
});

test('selects newest collection and refuses timestamp regression', () => {
  const old=summarize(feed('2026-10-11T18:00:00.000Z'));
  const fresh=summarize(feed('2026-10-11T20:00:00.000Z'));
  assert.deepEqual(selectSnapshot([old,fresh]),fresh);
  assert.deepEqual(selectSnapshot([old],fresh),fresh);
  assert.throws(()=>selectSnapshot([]));
});

test('unavailable primary feed uses the valid alternative', async () => {
  const result = await loadSnapshot({urls:['primary','alternative'],fetchImpl:async url=>({ok:url==='alternative',json:async()=>feed()})});
  assert.deepEqual(result,summarize(feed()));
});

test('temporary upstream failures retain cached counters and source timestamp', async () => {
  const cached=summarize(feed());
  const result=await loadSnapshot({urls:['failed'],cached,fetchImpl:async()=>{throw new Error('offline');}});
  assert.deepEqual(result,cached);
  await assert.rejects(loadSnapshot({urls:['failed'],fetchImpl:async()=>{throw new Error('offline');}}));
});

test('weekly publisher uses the supplied shared snapshot without fetching another collection', async () => {
  const snapshot=feed();
  const result=await loadSnapshot({snapshot,urls:[],fetchImpl:async()=>{throw new Error('must not fetch');}});
  assert.deepEqual(result,summarize(snapshot));
});

test('invalid supplied weekly snapshot fails closed rather than using stale cached data', async () => {
  await assert.rejects(loadSnapshot({snapshot:{owner:'other'},urls:[],cached:summarize(feed())}));
});
