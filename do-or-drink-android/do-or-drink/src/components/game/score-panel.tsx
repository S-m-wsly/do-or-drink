import { ChevronDown, GlassWater, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

export function ScorePanel() {
  const players = useGameStore((s) => s.players);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-xl bg-surface p-3 shadow-[0_0_0_1px_var(--color-border)]">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-muted">Live scores</span>
        <ChevronDown
          className={cn(
            "size-4 text-muted transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul className="mt-3 space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2"
            >
              <span className="truncate font-medium">{p.name}</span>
              <span className="flex items-center gap-3 text-sm tabular-nums text-muted">
                <span className="inline-flex items-center gap-1 text-fg">
                  <Zap className="size-3.5 text-primary" aria-hidden />
                  {p.completes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GlassWater className="size-3.5" aria-hidden />
                  {p.drinks}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
