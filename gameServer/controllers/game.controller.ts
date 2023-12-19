import { z } from "zod";
import { GameManager } from "../services/gameManager";
import { GameInstance } from "../domain/gameInstance/gameInstance.model";

const GamePostSchema = z.object({
  gameId: z.string(),
  gameStatus: z.union([
    z.literal("start"),
    z.literal("stop"),
    z.literal("pause"),
  ]),
});
export type GamePostData = z.infer<typeof GamePostSchema>;

export const gameController = (req: Request, gameManager: GameManager) => {
  const { method, body } = req;
  switch (method) {
    case "POST":
      const data = GamePostSchema.safeParse(body);
      if (!data.success) {
        return new Response("Invalid body", { status: 400 });
      }
      const { gameId } = data.data;
      return gameManager.updateGameStatus(
        gameId,
        getGameStateFromBody(data.data)
      );
    default:
      return new Response("Not found", { status: 404 });
  }
};

const getGameStateFromBody = (body: GamePostData): GameInstance["state"] => {
  const { gameStatus } = body;
  switch (gameStatus) {
    case "start":
      return "ongoing";
    case "stop":
      return "finished";
    case "pause":
      return "paused";
  }
};
