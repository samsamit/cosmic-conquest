import { BotMoveAction } from "../../communication/bot/action.schema";
import { BotAction } from "../../communication/bot/bot.communication";
import { BotGameAction } from "../../domain/gameInstance/gameInstance.model";
import { Entity, GameStateData } from "../../domain/gameState/gameState.schema";
import { createProjectile } from "../../domain/projectile/projectile.model";
import { createShip } from "../../domain/ship/ship.model";
import { handleMovement } from "./functions/handleMovement";
import { getCollisionShipId } from "./game.functions";

export const runActions = (
  actions: BotGameAction[],
  gameStateData: GameStateData
) => {
  let entitiesWithAction = getEntitiesWithActionTimelines(
    actions,
    gameStateData.entities
  );
  let runningActions = true;
  while (runningActions) {
    entitiesWithAction.forEach((entity) => {
      const action = entity.actions.shift();
      if (action) {
        switch (action.event) {
          case "move":
            const updatedEntities = handleMovement(
              entity,
              entitiesWithAction,
              gameStateData.gameSettings
            );
            break;
          default:
            break;
        }
      }
    });
  }
};

const getEntitiesWithActionTimelines = (
  actions: BotGameAction[],
  entities: GameStateData["entities"]
) => {
  const entitiesWithActions = entities.map((entity) => {
    const actionForEntity = actions.find(
      (action) => action.botToken === entity.id
    );
    const actionTimeline = actionForEntity
      ? getActionTimeline(actionForEntity)
      : [];
    return {
      ...entity,
      actions: actionTimeline,
    };
  });
  return entitiesWithActions;
};

const getActionTimeline = (action: BotGameAction): BotAction[] => {
  const { event, data } = action.action;
  switch (event) {
    case "move":
      return Array.from<BotMoveAction>({ length: data.steps }).fill({
        event: "move",
        data: { steps: 1 },
      } satisfies BotMoveAction);
    default:
      return [action.action];
  }
};
