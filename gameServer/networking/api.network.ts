import { gameController } from "../controllers/game/game.controller";
import { GameManager } from "../services/gameManager";

export const handleApiRoutes = (req: Request, gameManager: GameManager) => {
  const { pathname } = new URL(req.url);
  switch (true) {
    case pathname.includes("/game/"):
      return gameController(req, gameManager);
    default:
      return new Response("Not found", { status: 404 });
  }
};
