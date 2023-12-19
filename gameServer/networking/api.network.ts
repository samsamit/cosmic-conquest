import { gameController } from "../controllers/game.controller";
import { GameManager } from "../services/gameManager";

export const handleApiRoutes = (req: Request, gameManager: GameManager) => {
  const url = new URL(req.url);
  switch (url.pathname) {
    case "/gameState":
      return gameController(req, gameManager);
    default:
      return new Response("Not found", { status: 404 });
  }
};
