import { Action, Game, createGame } from "../models/game/game.model";

type GameId = string;
interface GameManager {
  games: Map<GameId, Game>;
  createGame: (gameData: Parameters<typeof createGame>[0]) => GameManager;
  get: (id: GameId) => Game;
  set: (id: GameId, game: Game) => GameManager;
  delete: (id: GameId) => GameManager;
  addAction: (gameId: string, action: Action) => GameManager;
}

const GameManager = () => {
  const gameManager: GameManager = {
    games: new Map(),
    createGame(gameData) {
      const game = createGame(gameData);
      this.games.set(gameData.id, game);
      return this;
    },
    get(id) {
      const game = this.games.get(id);
      if (!game) throw new Error(`Game with id ${id} not found`);
      return game;
    },
    set(id, game) {
      this.games.set(id, game);
      return this;
    },
    delete(id) {
      this.games.delete(id);
      return this;
    },
    addAction(gameId, action) {
      try {
        const game = this.games.get(gameId);
        if (!game) throw new Error(`Game not found`);
        const updatedGame = game.addAction(action);
        this.games = this.games.set(gameId, updatedGame);
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
      return this;
    },
  };

  return gameManager;
};

export default GameManager;
