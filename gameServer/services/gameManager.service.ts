interface GameInstance {
  id: string;
  worker: Worker;
}

class GameManager {
  private gameInstances: GameInstance[] = [];

  public createGameInstance(gameId: string) {
    const gameInstance = new Worker("./logic/game/gameInstance.js");
    if (this.gameInstances.find((gameInstance) => gameInstance.id === gameId))
      throw new Error("Game already exists");
    this.gameInstances.push({ id: gameId, worker: gameInstance });
    return gameInstance;
  }

  public getGameInstance(gameId: string) {
    return this.gameInstances.find(
      (gameInstance) => gameInstance.id === gameId
    );
  }
}

export default GameManager;
