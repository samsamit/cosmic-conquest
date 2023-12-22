import { z } from "zod";
import { GameManager } from "../../services/gameManager";
import { createGameSettings } from "../../domain/gameInstance/gameSettings.model";
import { getReqData, matchPathAndMethod } from "../contollerUtils";

const GameInitBodySchema = z.object({
  gameId: z.string(),
  participatingBots: z.array(
    z.object({ botId: z.string(), teamName: z.string() })
  ),
  gameSettings: z.object({
    mapWidth: z.number().int().positive().optional(),
    mapHeight: z.number().int().positive().optional(),
  }),
});
export type GameInitBody = z.infer<typeof GameInitBodySchema>;

const GameStateBodySchema = z.object({
  gameId: z.string(),
  state: z.union([z.literal("stop"), z.literal("start"), z.literal("pause")]),
});

// Path: /game/
export const gameController = async (
  req: Request,
  gameManager: GameManager
) => {
  switch (true) {
    case matchPathAndMethod(req, "/game/init", "POST"): {
      const { data, error } = await getReqData(req, GameInitBodySchema);
      if (error) return new Response(error, { status: 400 });
      const { gameId, gameSettings, participatingBots } = data;
      gameManager.createGame(
        gameId,
        createGameSettings({ ...gameSettings }),
        participatingBots
      );
      return new Response("Game created", { status: 200 });
    }
    case matchPathAndMethod(req, "/game/state", "POST"): {
      const { data, error } = await getReqData(req, GameStateBodySchema);
      if (error) return new Response(error, { status: 400 });
      const { gameId, state } = data;
      return gameManager.updateGameState(gameId, state);
    }
    default:
      return new Response("Not found", { status: 404 });
  }
};
