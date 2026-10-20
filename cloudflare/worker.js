/** Cloudflare catalog compatibility stage; stream resolution is NOT migrated. */
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,HEAD,OPTIONS","Access-Control-Allow-Headers":"Content-Type"};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{...cors,"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
const manifest = {
  id: 'com.kablekillers.sports.usa',
  version: '3.1.3',
  name: '⚡ Kable Killers Sports USA',
  description:
    'USA-focused sports catalogs including NFL, NBA, MLB, NHL, NCAA, and UFC worldwide. ' +
    'Live events, sports networks, and replays subject to source availability.',
  logo: '/logo.png',

  types: ['tv', 'series', 'channel'],
  resources: ['catalog', 'meta', 'stream'],

  catalogs: [
    { type: 'tv', id: 'nuvio_sports_teams', name: '⭐ Your Teams', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_live', name: '🔴 Live Now', extra: [
      { name: 'genre', options: ['American Football', 'Basketball', 'Baseball', 'Hockey', 'MMA', 'Motorsport', 'Golf'], isRequired: false },
      { name: 'search', isRequired: false }
    ] },
    { type: 'tv', id: 'nuvio_sports_networks', name: '📺 US Sports Channels', extra: [
      { name: 'search', isRequired: false },
      { name: 'skip', isRequired: false }
    ] },
    { type: 'tv', id: 'nuvio_sports_replays', name: '⏪ Sports Replays', extra: [{ name: 'skip', isRequired: true }] },
    
    // Parent Replay Catalogs
    { type: 'tv', id: 'nuvio_sports_replays_motorsport', name: '🏎️ Motorsport Replays', extra: [{ name: 'skip', isRequired: true }] },
    { type: 'tv', id: 'nuvio_sports_replays_baseball', name: '⚾ Baseball Replays', extra: [{ name: 'skip', isRequired: true }] },
    { type: 'tv', id: 'nuvio_sports_replays_basketball', name: '🏀 Basketball Replays', extra: [{ name: 'skip', isRequired: true }] },
    { type: 'tv', id: 'nuvio_sports_replays_hockey', name: '🏒 Hockey Replays', extra: [{ name: 'skip', isRequired: true }] },
    { type: 'tv', id: 'nuvio_sports_replays_american_football', name: '🏈 American Football Replays', extra: [{ name: 'skip', isRequired: true }] },

    { type: 'tv', id: 'nuvio_sports_basketball', name: '🏀 Basketball', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_motorsport', name: '🏁 US Motorsports', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_hockey', name: '🏒 Hockey', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_baseball', name: '⚾ Baseball', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_mma', name: '🥊 UFC & MMA', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_golf', name: '⛳ Golf', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_american_football', name: '🏈 American Football', extra: [{ name: 'search', isRequired: false }] },
    { type: 'tv', id: 'nuvio_sports_college', name: '🎓 College Sports', extra: [{ name: 'search', isRequired: false }] },

    { type: 'tv', id: 'nuvio_sports_upcoming', name: '⏱️ Upcoming', extra: [
      { name: 'genre', options: ['American Football', 'Basketball', 'Baseball', 'Hockey', 'MMA', 'Motorsport', 'Golf', 'College Sports'], isRequired: false },
      { name: 'search', isRequired: false }
    ] }
  ],

  config: [
    { key: 'teams', title: 'Favorite Teams (comma separated)', type: 'text' },
    { key: 'sports', title: 'Enabled Sports (comma separated)', type: 'text', default: 'american_football,basketball,baseball,hockey,mma,motorsport,golf,college' },
    { 
      key: 'timezone', 
      title: 'Timezone', 
      type: 'text',
      default: 'UTC'
    },
    // Preferred commentary languages, in order. Names or codes both work
    // ("Spanish, Arabic, Hindi", "es, ar, hi"); English is always ranked first
  // regardless.
    { key: 'languages', title: 'Preferred Languages (comma separated, English always first)', type: 'text' },
    // 'all' (default) lists every replay; 'mainstream' hides niche and
    // lower-division fixtures from the replay catalogs and hubs.
    { key: 'replayFilter', title: 'Replay Catalog (all or mainstream)', type: 'text', default: 'all' }
  ],

  idPrefixes: ['nuvio_sport_'],

  behaviorHints: {
    adult: false,
    p2p: false,
    configurable: true
  }};
manifest.logo = undefined;
manifest.description += " Cloudflare preview: catalogs and streams not yet connected.";
export default { async fetch(request) {
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
  if(request.method!=="GET"&&request.method!=="HEAD")return json({error:"Method not allowed"},405);
  if(url.pathname==="/"||url.pathname==="/health")return json({name:"Kable Killers Sports USA",status:"manifest-preview",readyForNuvio:false});
  if(url.pathname==="/manifest.json")return json(manifest);
  const catalogMatch=url.pathname.match(/^\/catalog\/(tv|series|channel)\/([^/]+)\.json$/);
  if(catalogMatch){
    const [,type,id]=catalogMatch;
    const supported=manifest.catalogs.some(c=>c.type===type&&c.id===id);
    if(!supported)return json({error:"Unknown catalog",id},404);
    return json({metas:[],_migration:{status:"provider-data-not-connected",catalog:id,readyForNuvio:false}});
  }
  if(/^\/(?:meta|stream)\//.test(url.pathname))return json({error:"Metadata and stream providers not yet migrated",readyForNuvio:false},501);
  return json({error:"Not found"},404);
}};
