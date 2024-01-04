import { ParticipantData, createGame } from "@/api/createGame";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/contexts/GameStateContext";
import { BotData } from "@/schemas/socket.schama";
import { FaSolidMinus, FaSolidPlus } from "solid-icons/fa";
import { Component, For, Match, Switch, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const GameSetup: Component = () => {
  const [gameData, { setGameId }] = useGameState();
  const [bots, setBots] = createStore<ParticipantData[]>(
    getParticipantData(gameData.bots ?? [])
  );
  const [selectedBots, setSelectedBots] = createSignal<ParticipantData[]>([]);
  const handleCreateGame = async () => {
    const gameId = await createGame(selectedBots());
    if (!gameId) {
      alert("Failed to create game");
      return;
    }
    setGameId(gameId);
  };

  const handleBotSelect = (bot: ParticipantData) => {
    if (selectedBots().find((b) => b.botToken === bot.botToken)) {
      setSelectedBots(
        selectedBots().filter((b) => b.botToken !== bot.botToken)
      );
    } else {
      setSelectedBots((prev) => [...prev, bot]);
    }
  };

  return (
    <div class="container pt-4">
      <h1>Game Setup</h1>
      <div class="flex flex-col gap-1 w-min">
        <For each={bots}>
          {(bot) => (
            <div class="flex items-center justify-between text-nowrap gap-2">
              <p>Token: {bot.botToken}</p>
              <SelectButton
                selected={selectedBots().includes(bot)}
                onToggle={() => handleBotSelect(bot)}
              />
            </div>
          )}
        </For>
      </div>
      <Button onClick={handleCreateGame}>Create Game</Button>
    </div>
  );
};

export default GameSetup;

const SelectButton: Component<{ selected: boolean; onToggle: () => void }> = (
  props
) => {
  return (
    <Switch>
      <Match when={!props.selected}>
        <Button size={"sm"} onClick={props.onToggle}>
          <FaSolidPlus />
        </Button>
      </Match>
      <Match when={props.selected}>
        <Button variant={"destructive"} size={"sm"} onClick={props.onToggle}>
          <FaSolidMinus />
        </Button>
      </Match>
    </Switch>
  );
};

const teamColors: string[] = [
  "#FF5733", // Team 1
  "#33FF57", // Team 2
  "#5733FF", // Team 3
  "#FF33A1", // Team 4
  "#33A1FF", // Team 5
  "#A1FF33", // Team 6
  "#FF3366", // Team 7
  "#3366FF", // Team 8
  "#FF6633", // Team 9
  "#6633FF", // Team 10
];

const getParticipantData = (bots: BotData[]) => {
  const teams = Array.from(new Set(bots.map((bot) => bot.connectionToken)));
  return bots.map<ParticipantData>((bot) => ({
    botToken: bot.botToken,
    teamName: bot.connectionToken,
    teamColor: teamColors[teams.indexOf(bot.connectionToken)],
  }));
};
