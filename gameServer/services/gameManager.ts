import { ServerWebSocket } from "bun";
import {
  GameInstance,
  Participant,
  createGameInstance,
} from "../domain/gameInstance/gameInstance.model";
import { BotSocketData } from "../networking/bot.network";
import { BotSocket } from "../types";
import { BotMessage } from "../communication/bot/bot.communication";
import { GameSettings } from "../domain/gameInstance/gameSettings.model";
import { GameInitBody } from "../controllers/game/game.controller";

export class GameManager {
  private games = new Map<string, GameInstance>();
  private connectedBots = new Map<string, BotSocket>();

  public createGame(
    gameId: string,
    settings: GameSettings,
    participatingBots: GameInitBody["participatingBots"]
  ) {
    const participants = participatingBots.map<Participant>((bot) => ({
      teamName: bot.teamName,
      botToken: bot.botToken,
      teamColor: bot.teamColor,
    }));
    const gameInstance = createGameInstance(gameId, settings, participants);
    for (const botToken of gameInstance.getParticipatingBotIds()) {
      const botSocket = this.connectedBots.get(botToken);
      if (botSocket) {
        gameInstance.sockets.set(botToken, botSocket);
        console.log("Connected bot to game", gameId);
      }
    }
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
      if (gameInstance.hasBot(botToken)) {
        gameInstance.sockets.set(botToken, socket);
        console.log("Bot connected to game", gameInstance.gameId);
      }
    }
    this.connectedBots.set(botToken, socket);
  }
  public removeConnectedBot(botToken: string) {
    for (const [_, gameInstance] of this.games) {
      if (gameInstance.hasBot(botToken)) {
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
        gameInstance.actionQueue.push({
          botToken: botData.botToken,
          action: message.action,
        });
        this.games.set(gameId, gameInstance);
        console.log("action from bot: ", botData.botToken, message);
        break;
      default:
        break;
    }
  }

  public updateGameState(gameId: string, gameStatus: GameInstance["state"]) {
    const gameInstance = this.games.get(gameId);
    if (!gameInstance) {
      return new Response("Game not found", { status: 404 });
    }
    gameInstance.state = gameStatus;
    this.games.set(gameId, gameInstance);
    return new Response("Game status updated", { status: 200 });
  }

  public run() {
    console.log("Game manager running");
    setInterval(() => {
      for (const [_, gameInstance] of this.games) {
        if (gameInstance.state === "ongoing" && !gameInstance.loopInterval) {
          gameInstance.loopInterval = setInterval(() => {
            // console.log("Game tick for game", gameInstance.gameId);
          }, gameInstance.gameSettings.tickLength);
        } else if (
          gameInstance.state === "finished" &&
          gameInstance.loopInterval
        ) {
          clearInterval(gameInstance.loopInterval);
          gameInstance.loopInterval = null;
        }
      }
    }, 1000);
  }
}
