import { Plus, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/store/game-store";

export function SetupScreen() {
  const players = useGameStore((s) => s.players);
  const addPlayer = useGameStore((s) => s.addPlayer);
  const removePlayer = useGameStore((s) => s.removePlayer);
  const startGame = useGameStore((s) => s.startGame);
  const [name, setName] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    addPlayer(name);
    setName("");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-10 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="animate-rise space-y-3 text-center">
        <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">
          Late night
        </p>
        <h1 className="font-display text-5xl leading-none font-semibold tracking-tight text-fg sm:text-6xl">
          Do or Drink
        </h1>
        <p className="text-muted">Do it or drink</p>
      </header>

      <form onSubmit={onSubmit} className="animate-rise-delay-1 mt-8 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a player"
          maxLength={24}
          aria-label="Player name"
          autoComplete="off"
        />
        <Button type="submit" size="icon" aria-label="Add player" disabled={!name.trim()}>
          <Plus className="size-5" />
        </Button>
      </form>

      <section className="animate-rise-delay-2 mt-5 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {players.length === 0 ? (
          <p className="rounded-lg bg-surface px-4 py-5 text-center text-sm text-muted shadow-[0_0_0_1px_var(--color-border)]">
            Add at least two names to start.
          </p>
        ) : (
          <ul className="space-y-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-surface px-4 py-3 shadow-[0_0_0_1px_var(--color-border)]"
              >
                <span className="truncate font-medium">{p.name}</span>
                <button
                  type="button"
                  onClick={() => removePlayer(p.id)}
                  className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-elevated hover:text-fg"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button
        size="xl"
        className="animate-rise-delay-3 mt-6"
        disabled={players.length < 2}
        onClick={startGame}
      >
        Start Game
      </Button>
    </div>
  );
}
