export const defaultTeamColors: string[] = [
  "#FF5733",
  "#33FF57",
  "#5733FF",
  "#FF33A1",
  "#33A1FF",
  "#A1FF33",
  "#FF3366",
  "#3366FF",
  "#FF6633",
  "#6633FF",
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
  "Orange",
  "Dark Blue",
] as const;

export const defaultTeams = defaultTeamNames.map((name, index) => ({
  name,
  color: defaultTeamColors[index],
}));

export const INITIAL_TEAM_NAME = "Connected bots";
