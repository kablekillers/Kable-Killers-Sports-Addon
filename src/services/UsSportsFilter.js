'use strict';
// Conservative US-league filter. Unknown events are hidden, not mislabelled.
const RULES = {
  american_football: /\b(NFL|NCAA|CFB|college football|FBS|FCS)\b/i,
  basketball: /\b(NBA|WNBA|NCAA|NCAAB|college basketball|March Madness|G League)\b/i,
  baseball: /\b(MLB|MiLB|minor league baseball|NCAA|college baseball)\b/i,
  hockey: /\b(NHL|AHL|ECHL|NCAA|college hockey)\b/i,
  mma: /\b(UFC|UFC Fight Night|Dana White's Contender Series)\b/i,
  motorsport: /\b(NASCAR|IndyCar|Indy 500|Daytona|Xfinity Series|Truck Series)\b/i,
  golf: /\b(PGA|LPGA|US Open|Masters|Ryder Cup|FedEx Cup)\b/i,
  college: /\b(NCAA|college|CFB|NCAAB|FBS|FCS)\b/i
};
const CHANNELS = /\b(ESPN|ESPN2|ESPNU|SEC Network|ACC Network|Big Ten Network|BTN|NFL Network|RedZone|MLB Network|NBA TV|NHL Network|CBS Sports|CBSSN|FS1|FS2|Fox Sports|Golf Channel|TNT Sports|TBS|USA Network|NBC Sports|FanDuel Sports Network)\b/i;

const NFL_TEAMS = new Set(["cardinals","falcons","ravens","bills","panthers","bears","bengals","browns","cowboys","broncos","lions","packers","texans","colts","jaguars","chiefs","raiders","chargers","rams","dolphins","vikings","patriots","saints","giants","jets","eagles","steelers","49ers","seahawks","buccaneers","titans","commanders"]);
function isNflTeamMatchup(label) {
  const names = [...NFL_TEAMS].join('|');
  const re = new RegExp('\\b(' + names + ')\\s+(?:vs\\.?|v\\.?|at|@|-)\\s+(' + names + ')\\b', 'i');
  const match = String(label).match(re);
  return Boolean(match && match[1].toLowerCase() !== match[2].toLowerCase());
}
function isUsSportsMatch(match) {
  if (!match) return false;
  const category = String(match.category || '').toLowerCase();
  const label = [match.title, match.league, match.competition, match.name].filter(Boolean).join(' ');
  if (category === 'networks') return CHANNELS.test(label);
  if (/\bCFL\b/i.test(label)) return false;
  if (category === 'american_football' && isNflTeamMatchup(label)) return true;
  const rule = RULES[category];
  return Boolean(rule && rule.test(label));
}
module.exports = { isUsSportsMatch, isNflTeamMatchup };
