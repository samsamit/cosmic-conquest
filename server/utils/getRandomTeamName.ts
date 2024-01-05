import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export const getRandomTeamName = (connectionToken: string) => {
  const randomName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: " ",
    style: "capital",
    seed: connectionToken,
  });
  return randomName;
};
