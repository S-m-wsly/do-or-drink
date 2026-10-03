import { GlassWater, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rankedPlayers, useGameStore, winners } from "@/store/game-store";

export function ResultsScreen() {
  const players = useGameStore((s) => s.players);
  const playAgain = useGameStore((s) => s.playAgain);
  const newGame = useGameStore((s) => s.newGame);
  const ranked = rankedPlayers(players);
  const { fearless, wuss } = winners(players);
  const fearlessScore = fearless[0]?.completes ?? 0;
  const wussScore = wuss[0]?.drinks ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
          After 4 rounds
        </p>
        <h2 className="font-display text-4xl font-semibold tracking-tight">Results</h2>
      </header>

      <div className="grid gap-3">
        <div className="animate-rise rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)]">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            <Zap className="size-4" aria-hidden />
            Fearless
          </div>
          <p className="font-display text-2xl font-semibold">
            {fearlessScore === 0 ? "Nobody completed a prompt" : fearless.map((p) => p.name).join(" & ")}
          </p>
          {fearlessScore > 0 && (
            <p className="mt-1 text-sm text-muted tabular-nums">{fearlessScore} completed</p>
          )}
        </div>
        <div className="animate-rise-delay-1 rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)]">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted uppercase">
            <GlassWater className="size-4" aria-hidden />
            Biggest Wuss
          </div>
          <p className="font-display text-2xl font-semibold">
            {wussScore === 0 ? "Nobody drank" : wuss.map((p) => p.name).join(" & ")}
          </p>
          {wussScore > 0 && (
            <p className="mt-1 text-sm text-muted tabular-nums">{wussScore} drinks</p>
          )}
        </div>
      </div>

      <ol className="animate-rise-delay-2 space-y-2">
        {ranked.map((p, i) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg bg-elevated px-4 py-3"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="w-6 text-sm tabular-nums text-muted">{i + 1}</span>
              <span className="truncate font-medium">{p.name}</span>
            </span>
            <span className="text-sm tabular-nums text-muted">
              {p.completes} / {p.drinks}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-center text-xs text-subtle">Completed / drinks</p>

      <div className="grid gap-3">
        <Button size="xl" onClick={playAgain}>
          Play Again
        </Button>
        <Button size="lg" variant="outline" onClick={newGame}>
          New Game
        </Button>
      </div>
    </div>
  );
}
