import { Action, Game, GameState, createGame } from "../models/game/game.model";

type GameId = string;
interface GameManager {
  games: Map<GameId, Game>;
  gameLoopInterval: NodeJS.Timeout | null;
  createGame: (gameData: Parameters<typeof createGame>[0]) => GameManager;
  get: (id: GameId) => Game;
  set: (id: GameId, game: Game) => GameManager;
  delete: (id: GameId) => GameManager;
  addAction: (gameId: string, action: Action) => GameManager;
  getBotsGameID: (botToken: string) => string | null;
  runGameLoop: (updateGameStateCallback: (gameId: string) => void) => void;
}

const GameManager = () => {
  const gameManager: GameManager = {
    games: new Map(),
    gameLoopInterval: null,
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
    getBotsGameID(botToken) {
      for (const [gameId, game] of this.games.entries()) {
        if (game.participants.find((p) => p.botToken === botToken))
          return gameId;
      }
      return null;
    },
    runGameLoop(updateGameStateCallback) {
      if (this.gameLoopInterval) return;
      this.gameLoopInterval = setInterval(() => {
        for (const [_, game] of this.games.entries()) {
          switch (game.state) {
            case GameState.RUNNING:
              game.gameRunner(updateGameStateCallback);
            default:
              return;
          }
        }
      }, 1000);
    },
  };

  return gameManager;
};

export default GameManager;
