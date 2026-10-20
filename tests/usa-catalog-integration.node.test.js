'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root,'src/index.js'),'utf8');
const catalog = fs.readFileSync(path.join(root,'src/catalog.js'),'utf8');
const manifest = fs.readFileSync(path.join(root,'src/manifest.js'),'utf8');
const rows = index.slice(index.indexOf('const REPLAY_MANIFEST_ROWS = ['), index.indexOf('\n];', index.indexOf('const REPLAY_MANIFEST_ROWS = [')));
const hubs = catalog.slice(catalog.indexOf('const REPLAY_SPORTS = ['),catalog.indexOf('\n];',catalog.indexOf('const REPLAY_SPORTS = [')));
test('dynamic replay rows exclude non-US sports',()=>{
  assert.doesNotMatch(rows,/nuvio_sports_replays_(?:football|rugby|tennis)_|motorsport_f1/);
  assert.match(rows,/nuvio_sports_replays_american_football_nfl/);
  assert.match(rows,/nuvio_sports_replays_baseball_mlb/);
});
test('replay home screen excludes international sport hubs',()=>{
  assert.doesNotMatch(hubs,/id: '(?:football|rugby|tennis)'/);
  for(const sport of ['motorsport','baseball','basketball','hockey','american_football']) assert.ok(hubs.includes("id: '"+sport+"'"));
});
test('manifest default uses actual category identifiers',()=>{
  assert.match(manifest,/default: 'american_football,basketball,baseball,hockey,mma,motorsport,golf,college'/);
  assert.doesNotMatch(manifest,/Cricket|Rugby|Tennis|Formula 1|Premier League/);
});
test('manifest visibility uses USA filtered matches',()=>{
  assert.match(index,/isUsSportsMatch\(m\)\) present\.add/);
});
