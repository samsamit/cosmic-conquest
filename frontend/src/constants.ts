export const defaultTeamColors: string[] = [
  "hsl(4, 100%, 57%)",
  "hsl(100, 100%, 37%)",
  "hsl(248, 100%, 57%)",
  "hsl(324, 100%, 57%)",
  "hsl(204, 100%, 67%)",
  "hsl(54, 100%, 57%)",
  "hsl(16, 100%, 57%)",
  "hsl(264, 100%, 57%)",
] as const;

export const defaultTeamNames: string[] = [
  "Red",
  "Green",
  "Blue",
  "Pink",
  "Light Blue",
  "Yellow",
  "Orange",
  "Purple",
] as const;

export const defaultTeams = defaultTeamNames.map((name, index) => ({
  name,
  color: defaultTeamColors[index],
}));

export const INITIAL_TEAM_NAME = "Connected bots";
