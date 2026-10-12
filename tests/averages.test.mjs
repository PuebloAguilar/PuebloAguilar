import test from 'node:test';
import assert from 'node:assert/strict';
import * as usage from '../scripts/usage.mjs';

test('averages use recorded active days and distinct sessions',()=>{
  const snapshot={all:{startDate:'2026-03-01',endDate:'2026-03-30',totalTokens:1200,messages:15,activeDays:3,sessions:2}};
  assert.deepEqual(usage.usageAverages?.(snapshot),{tokensPerActiveDay:400,messagesPerActiveDay:5,tokensPerSession:600});
});

test('zero denominators leave averages unavailable',()=>{
  const snapshot={all:{totalTokens:0,messages:0,activeDays:0,sessions:0}};
  assert.deepEqual(usage.usageAverages?.(snapshot),{tokensPerActiveDay:null,messagesPerActiveDay:null,tokensPerSession:null});
});
