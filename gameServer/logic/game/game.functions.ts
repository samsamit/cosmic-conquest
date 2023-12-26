import { BotMoveAction } from "../../communication/bot/action.schema";
import {
  BotGameAction,
  Participant,
} from "../../domain/gameInstance/gameInstance.model";
import { GameSettings } from "../../domain/gameInstance/gameSettings.model";
import { Entity, GameStateData } from "../../domain/gameState/gameState.schema";
import { Position } from "../../domain/general.schema";
import { createProjectile } from "../../domain/projectile/projectile.model";
import { createShip } from "../../domain/ship/ship.model";
import { ShipData } from "../../domain/ship/ship.schema";
import {
  getForwardPosition,
  getStepsBetweenPositions,
} from "../movement/movement.logic";
import { getStartingPositionsForTeams } from "./functions/getStartingPositions";

export const initShips = (
  participants: Participant[],
  gameSettings: GameSettings
) => {
  const participantsWithPositions = getStartingPositionsForTeams(
    participants,
    gameSettings.mapWidth,
    gameSettings.mapHeight,
    gameSettings.shipRadius * 2 + 1
  );
  const ships: ShipData[] = [];
  participantsWithPositions.forEach((participant) => {
    ships.push({
      type: "ship",
      id: participant.botToken,
      teamColor: participant.teamColor,
      position: participant.position,
      direction: participant.direction,
      heat: {
        current: 0,
        max: gameSettings.maxHeat,
      },
      health: {
        current: gameSettings.maxHealth,
        max: gameSettings.maxHealth,
      },
      vision: gameSettings.vision,
      hitboxRadius: gameSettings.shipRadius,
      team: participant.teamName,
    });
  });
};

export const getCollisionShipId = (
  position: Position,
  entities: Entity[]
): string | null => {
  const collision = entities.find((entity) => {
    if (entity.type === "ship") {
      const ship = createShip(entity);
      const shipHitbox = ship.getHitbox();
      return shipHitbox.some(
        (hitboxPosition) =>
          hitboxPosition.x === position.x && hitboxPosition.y === position.y
      );
    }
    return false;
  });
  return collision ? collision.id : null;
};
