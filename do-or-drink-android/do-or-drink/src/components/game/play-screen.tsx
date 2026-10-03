import { CircleHelp, GlassWater, Zap } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScorePanel } from "@/components/game/score-panel";
import {
  currentPlayer,
  TOTAL_GAME_ROUNDS,
  useGameStore,
} from "@/store/game-store";

export function PlayScreen() {
  const phase = useGameStore((s) => s.phase);
  const round = useGameStore((s) => s.round);
  const turnIndex = useGameStore((s) => s.turnIndex);
  const roundOrder = useGameStore((s) => s.roundOrder);
  const currentKind = useGameStore((s) => s.currentKind);
  const currentText = useGameStore((s) => s.currentText);
  const drawPrompt = useGameStore((s) => s.drawPrompt);
  const resolveTurn = useGameStore((s) => s.resolveTurn);
  const continueAfterRound = useGameStore((s) => s.continueAfterRound);
  const player = useGameStore(currentPlayer);

  useEffect(() => {
    if (phase !== "roundComplete") return;
    const id = window.setTimeout(() => continueAfterRound(), 1800);
    return () => window.clearTimeout(id);
  }, [phase, continueAfterRound]);

  if (phase === "roundComplete") {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-6 px-5 py-10 text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
          Checkpoint
        </p>
        <h2 className="font-display animate-rise text-4xl font-semibold tracking-tight">
          Round {round} complete
        </h2>
        <p className="animate-rise-delay-1 text-muted">
          Everyone has played. Next round starts now.
        </p>
        <Button size="lg" className="animate-rise-delay-2 mt-2 w-full" onClick={continueAfterRound}>
          Next round
        </Button>
      </div>
    );
  }

  if (!player) return null;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <div className="flex items-center justify-between text-sm text-muted">
        <span className="tabular-nums">
          Round {round} of {TOTAL_GAME_ROUNDS}
        </span>
        <span className="tabular-nums">
          Turn {turnIndex + 1}/{roundOrder.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <div className="space-y-2">
          <p className="text-muted">It’s</p>
          <h2 className="font-display animate-rise text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {player.name}
            <span className="text-muted">’s turn</span>
          </h2>
        </div>

        {phase === "turn" && (
          <Button size="xl" className="max-w-xs animate-rise-delay-1" onClick={drawPrompt}>
            Do
          </Button>
        )}

        {phase === "prompt" && currentKind && currentText && (
          <div className="animate-rise w-full space-y-6">
            <article className="rounded-2xl bg-surface p-6 text-left shadow-[0_0_0_1px_var(--color-border)]">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                {currentKind === "truth" ? (
                  <CircleHelp className="size-4" aria-hidden />
                ) : (
                  <Zap className="size-4" aria-hidden />
                )}
                {currentKind === "truth" ? "Truth" : "Dare"}
              </div>
              <p className="font-display text-xl leading-snug font-medium text-pretty sm:text-2xl">
                {currentText}
              </p>
            </article>
            <div className="grid grid-cols-2 gap-3">
              <Button size="lg" onClick={() => resolveTurn("complete")}>
                Complete
              </Button>
              <Button size="lg" variant="drink" onClick={() => resolveTurn("drink")}>
                <GlassWater className="size-4" aria-hidden />
                Drink
              </Button>
            </div>
          </div>
        )}
      </div>

      <ScorePanel />
    </div>
  );
}
