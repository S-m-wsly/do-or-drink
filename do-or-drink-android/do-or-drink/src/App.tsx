import { PlayScreen } from "@/components/game/play-screen";
import { ResultsScreen } from "@/components/game/results-screen";
import { SetupScreen } from "@/components/game/setup-screen";
import { useGameStore } from "@/store/game-store";

export function App() {
  const phase = useGameStore((s) => s.phase);

  return (
    <main className="min-h-dvh bg-bg text-fg">
      {phase === "setup" && <SetupScreen />}
      {(phase === "turn" || phase === "prompt" || phase === "roundComplete") && <PlayScreen />}
      {phase === "results" && <ResultsScreen />}
    </main>
  );
}
