import { ServerWebSocket } from "bun";
import {
  GameInstance,
  createGameInstance,
} from "../domain/gameInstance/gameInstance.model";
import { BotSocketData } from "../networking/bot.network";
import { BotSocket } from "../types";
import { BotMessage } from "../communication/bot/bot.communication";

export class GameManager {
  private games = new Map<string, GameInstance>();
  private connectedBots = new Map<string, BotSocket>();

  public createGame(gameId: string) {
    const gameInstance = createGameInstance(gameId);
    this.games.set(gameId, gameInstance);
    return gameInstance;
  }

  public getGame(gameId: string) {
    return this.games.get(gameId);
  }

  public deleteGame(gameId: string) {
    this.games.delete(gameId);
  }

  public addConnectedBot(
    botToken: string,
    socket: ServerWebSocket<BotSocketData>
  ) {
    for (const [_, gameInstance] of this.games) {
      if (gameInstance.participatingBotIds.includes(botToken)) {
        gameInstance.sockets.set(botToken, socket);
      }
    }
    this.connectedBots.set(botToken, socket);
  }
  public removeConnectedBot(botToken: string) {
    for (const [_, gameInstance] of this.games) {
      if (gameInstance.participatingBotIds.includes(botToken)) {
        gameInstance.sockets.delete(botToken);
      }
    }
    this.connectedBots.delete(botToken);
  }

  public handleBotMessage(botData: BotSocketData, message: BotMessage) {
    const { gameId } = botData;
    if (!gameId) return;
    const gameInstance = this.games.get(gameId);
    if (!gameInstance) {
      return;
    }
    switch (message.event) {
      case "action":
        gameInstance.actionQueue.push(message);
        this.games.set(gameId, gameInstance);
        break;
      default:
        break;
    }
  }

  public updateGameStatus(gameId: string, gameStatus: GameInstance["state"]) {
    const gameInstance = this.games.get(gameId);
    if (!gameInstance) {
      return;
    }
    gameInstance.state = gameStatus;
    this.games.set(gameId, gameInstance);
  }
}
