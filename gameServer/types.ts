import { ServerWebSocket } from "bun";
import { BotSocketData } from "./networking/bot.network";
import { ClientSocketData } from "./networking/client.network";

export type BotSocket = ServerWebSocket<BotSocketData>;
export type ClientSocket = ServerWebSocket<ClientSocketData>;
