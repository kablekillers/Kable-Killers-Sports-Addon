'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { isUsSportsMatch, isLeagueMatchup } = require('../src/services/UsSportsFilter');
const accepted = [
 ['american_football','Packers vs Bears'], ['american_football','Kansas City Chiefs vs Buffalo Bills'],
 ['baseball','Brewers vs Cubs'],['baseball','Milwaukee Brewers vs Chicago Cubs'],
 ['basketball','Bucks vs Celtics'],['basketball','Milwaukee Bucks vs Boston Celtics'],
 ['hockey','Red Wings vs Blackhawks'],['hockey','Detroit Red Wings vs Chicago Blackhawks'],
 ['mma','UFC 330 London'],['motorsport','NASCAR Cup Series'],['golf','PGA Tour'],['networks','ESPN2']
];
const rejected = [
 ['american_football','CFL Toronto Argonauts vs Winnipeg Blue Bombers'],
 ['football','Premier League Arsenal vs Chelsea'],
 ['basketball','EuroLeague Real Madrid vs Barcelona'],
 ['motorsport','Formula 1 Monaco Grand Prix'],['cricket','IPL cricket'],
 ['networks','beIN Sports Soccer']
];
for(const [category,title] of accepted) test('allow '+category+': '+title,()=>assert.equal(isUsSportsMatch({category,title}),true));
for(const [category,title] of rejected) test('block '+category+': '+title,()=>assert.equal(isUsSportsMatch({category,title}),false));
test('same team rejected',()=>assert.equal(isLeagueMatchup('baseball','Brewers vs Brewers'),false));
