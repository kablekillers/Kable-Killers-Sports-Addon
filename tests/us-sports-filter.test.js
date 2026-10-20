const { isUsSportsMatch, isLeagueMatchup } = require('../src/services/UsSportsFilter');

describe('Kable Killers USA sports filtering', () => {
  test.each([
    ['american_football', 'Packers vs Bears'],
    ['american_football', 'Kansas City Chiefs vs Buffalo Bills'],
    ['baseball', 'Brewers vs Cubs'],
    ['baseball', 'Milwaukee Brewers vs Chicago Cubs'],
    ['basketball', 'Bucks vs Celtics'],
    ['basketball', 'Milwaukee Bucks vs Boston Celtics'],
    ['hockey', 'Red Wings vs Blackhawks'],
    ['hockey', 'Detroit Red Wings vs Chicago Blackhawks'],
    ['mma', 'UFC 330 London'],
    ['motorsport', 'NASCAR Cup Series'],
    ['golf', 'PGA Tour'],
    ['networks', 'ESPN2']
  ])('accepts %s: %s', (category, title) => {
    expect(isUsSportsMatch({ category, title })).toBe(true);
  });

  test.each([
    ['american_football', 'CFL Toronto Argonauts vs Winnipeg Blue Bombers'],
    ['football', 'Premier League Arsenal vs Chelsea'],
    ['basketball', 'EuroLeague Real Madrid vs Barcelona'],
    ['motorsport', 'Formula 1 Monaco Grand Prix'],
    ['cricket', 'IPL cricket'],
    ['networks', 'beIN Sports Soccer']
  ])('rejects %s: %s', (category, title) => {
    expect(isUsSportsMatch({ category, title })).toBe(false);
  });

  test('rejects identical teams', () => {
    expect(isLeagueMatchup('baseball', 'Brewers vs Brewers')).toBe(false);
  });
});
