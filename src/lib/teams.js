const NBA_TEAMS = [
  // === Western Conference ===
  // Northwest
  { teamId: 1610612760, name: "Thunder", city: "Oklahoma City", tricode: "OKC", slug: "thunder", conference: "West", division: "Northwest", primaryColor: "#007AC1", secondaryColor: "#EF6100" },
  { teamId: 1610612750, name: "Timberwolves", city: "Minnesota", tricode: "MIN", slug: "timberwolves", conference: "West", division: "Northwest", primaryColor: "#0C2340", secondaryColor: "#236192" },
  { teamId: 1610612743, name: "Nuggets", city: "Denver", tricode: "DEN", slug: "nuggets", conference: "West", division: "Northwest", primaryColor: "#0E2240", secondaryColor: "#FEC524" },
  { teamId: 1610612757, name: "Trail Blazers", city: "Portland", tricode: "POR", slug: "blazers", conference: "West", division: "Northwest", primaryColor: "#E03A3E", secondaryColor: "#000000" },
  { teamId: 1610612762, name: "Jazz", city: "Utah", tricode: "UTA", slug: "jazz", conference: "West", division: "Northwest", primaryColor: "#002B5C", secondaryColor: "#F9A01B" },

  // Pacific
  { teamId: 1610612744, name: "Warriors", city: "Golden State", tricode: "GSW", slug: "warriors", conference: "West", division: "Pacific", primaryColor: "#1D428A", secondaryColor: "#FFC72C" },
  { teamId: 1610612746, name: "Clippers", city: "LA", tricode: "LAC", slug: "clippers", conference: "West", division: "Pacific", primaryColor: "#C8102E", secondaryColor: "#1D428A" },
  { teamId: 1610612747, name: "Lakers", city: "Los Angeles", tricode: "LAL", slug: "lakers", conference: "West", division: "Pacific", primaryColor: "#552583", secondaryColor: "#FDB927" },
  { teamId: 1610612756, name: "Suns", city: "Phoenix", tricode: "PHX", slug: "suns", conference: "West", division: "Pacific", primaryColor: "#1D1160", secondaryColor: "#E56020" },
  { teamId: 1610612758, name: "Kings", city: "Sacramento", tricode: "SAC", slug: "kings", conference: "West", division: "Pacific", primaryColor: "#5A2D81", secondaryColor: "#63727A" },

  // Southwest
  { teamId: 1610612742, name: "Mavericks", city: "Dallas", tricode: "DAL", slug: "mavericks", conference: "West", division: "Southwest", primaryColor: "#00538C", secondaryColor: "#002B5E" },
  { teamId: 1610612745, name: "Rockets", city: "Houston", tricode: "HOU", slug: "rockets", conference: "West", division: "Southwest", primaryColor: "#CE1141", secondaryColor: "#000000" },
  { teamId: 1610612763, name: "Grizzlies", city: "Memphis", tricode: "MEM", slug: "grizzlies", conference: "West", division: "Southwest", primaryColor: "#5D76A9", secondaryColor: "#12173F" },
  { teamId: 1610612740, name: "Pelicans", city: "New Orleans", tricode: "NOP", slug: "pelicans", conference: "West", division: "Southwest", primaryColor: "#0C2340", secondaryColor: "#C8102E" },
  { teamId: 1610612759, name: "Spurs", city: "San Antonio", tricode: "SAS", slug: "spurs", conference: "West", division: "Southwest", primaryColor: "#C4CED4", secondaryColor: "#000000" },

  // === Eastern Conference ===
  // Atlantic
  { teamId: 1610612738, name: "Celtics", city: "Boston", tricode: "BOS", slug: "celtics", conference: "East", division: "Atlantic", primaryColor: "#007A33", secondaryColor: "#BA9653" },
  { teamId: 1610612751, name: "Nets", city: "Brooklyn", tricode: "BKN", slug: "nets", conference: "East", division: "Atlantic", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { teamId: 1610612752, name: "Knicks", city: "New York", tricode: "NYK", slug: "knicks", conference: "East", division: "Atlantic", primaryColor: "#006BB6", secondaryColor: "#F58426" },
  { teamId: 1610612755, name: "76ers", city: "Philadelphia", tricode: "PHI", slug: "sixers", conference: "East", division: "Atlantic", primaryColor: "#006BB6", secondaryColor: "#ED174C" },
  { teamId: 1610612761, name: "Raptors", city: "Toronto", tricode: "TOR", slug: "raptors", conference: "East", division: "Atlantic", primaryColor: "#CE1141", secondaryColor: "#000000" },

  // Central
  { teamId: 1610612741, name: "Bulls", city: "Chicago", tricode: "CHI", slug: "bulls", conference: "East", division: "Central", primaryColor: "#CE1141", secondaryColor: "#000000" },
  { teamId: 1610612739, name: "Cavaliers", city: "Cleveland", tricode: "CLE", slug: "cavaliers", conference: "East", division: "Central", primaryColor: "#860038", secondaryColor: "#FDBB30" },
  { teamId: 1610612765, name: "Pistons", city: "Detroit", tricode: "DET", slug: "pistons", conference: "East", division: "Central", primaryColor: "#C8102E", secondaryColor: "#1D42BA" },
  { teamId: 1610612754, name: "Pacers", city: "Indiana", tricode: "IND", slug: "pacers", conference: "East", division: "Central", primaryColor: "#002D62", secondaryColor: "#FDBB30" },
  { teamId: 1610612749, name: "Bucks", city: "Milwaukee", tricode: "MIL", slug: "bucks", conference: "East", division: "Central", primaryColor: "#00471B", secondaryColor: "#EEE1C6" },

  // Southeast
  { teamId: 1610612737, name: "Hawks", city: "Atlanta", tricode: "ATL", slug: "hawks", conference: "East", division: "Southeast", primaryColor: "#E03A3E", secondaryColor: "#C1D32F" },
  { teamId: 1610612766, name: "Hornets", city: "Charlotte", tricode: "CHA", slug: "hornets", conference: "East", division: "Southeast", primaryColor: "#1D1160", secondaryColor: "#00788C" },
  { teamId: 1610612748, name: "Heat", city: "Miami", tricode: "MIA", slug: "heat", conference: "East", division: "Southeast", primaryColor: "#98002E", secondaryColor: "#F9A01B" },
  { teamId: 1610612753, name: "Magic", city: "Orlando", tricode: "ORL", slug: "magic", conference: "East", division: "Southeast", primaryColor: "#0077C0", secondaryColor: "#C4CED4" },
  { teamId: 1610612764, name: "Wizards", city: "Washington", tricode: "WAS", slug: "wizards", conference: "East", division: "Southeast", primaryColor: "#002B5C", secondaryColor: "#E31837" },
];

export function getTeamBySlug(slug) {
  return NBA_TEAMS.find((t) => t.slug === slug) || null;
}

export function getTeamById(teamId) {
  return NBA_TEAMS.find((t) => t.teamId === teamId) || null;
}

export function getLogoUrl(teamId) {
  return `https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`;
}

export const WEST_TEAMS = NBA_TEAMS.filter((t) => t.conference === "West");
export const EAST_TEAMS = NBA_TEAMS.filter((t) => t.conference === "East");

export default NBA_TEAMS;
