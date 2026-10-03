import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DARES } from "@/data/dares";
import { TRUTHS } from "@/data/truths";
import { pickUnused, shuffle } from "@/lib/shuffle";

export type Player = {
  id: string;
  name: string;
  completes: number;
  drinks: number;
};

export type PromptKind = "truth" | "dare";
export type Phase = "setup" | "turn" | "prompt" | "roundComplete" | "results";

const TOTAL_ROUNDS = 4;

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Math.random().toString(36).slice(2, 10)}`;
}

type GameState = {
  players: Player[];
  phase: Phase;
  round: number;
  roundOrder: string[];
  turnIndex: number;
  currentKind: PromptKind | null;
  currentText: string | null;
  usedTruths: number[];
  usedDares: number[];
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  drawPrompt: () => void;
  resolveTurn: (choice: "complete" | "drink") => void;
  continueAfterRound: () => void;
  playAgain: () => void;
  newGame: () => void;
};

function startRound(players: Player[], round: number) {
  return {
    round,
    roundOrder: shuffle(players.map((p) => p.id)),
    turnIndex: 0,
    phase: "turn" as const,
    currentKind: null as PromptKind | null,
    currentText: null as string | null,
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      players: [],
      phase: "setup",
      round: 1,
      roundOrder: [],
      turnIndex: 0,
      currentKind: null,
      currentText: null,
      usedTruths: [],
      usedDares: [],

      addPlayer: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((s) => ({
          players: [
            ...s.players,
            { id: newId(), name: trimmed, completes: 0, drinks: 0 },
          ],
        }));
      },

      removePlayer: (id) => {
        set((s) => ({ players: s.players.filter((p) => p.id !== id) }));
      },

      startGame: () => {
        const { players } = get();
        if (players.length < 2) return;
        set({
          players: players.map((p) => ({ ...p, completes: 0, drinks: 0 })),
          usedTruths: [],
          usedDares: [],
          ...startRound(players, 1),
        });
      },

      drawPrompt: () => {
        const kind: PromptKind = Math.random() < 0.5 ? "truth" : "dare";
        const pool = kind === "truth" ? TRUTHS : DARES;
        const usedSet = new Set(kind === "truth" ? get().usedTruths : get().usedDares);
        const { text, index } = pickUnused(pool, usedSet);
        set({
          currentKind: kind,
          currentText: text,
          phase: "prompt",
          usedTruths: kind === "truth" ? [...usedSet] : get().usedTruths,
          usedDares: kind === "dare" ? [...usedSet] : get().usedDares,
        });
        void index;
      },

      resolveTurn: (choice) => {
        const { roundOrder, turnIndex, players, round } = get();
        const playerId = roundOrder[turnIndex];
        if (!playerId) return;

        const nextPlayers = players.map((p) =>
          p.id === playerId
            ? {
                ...p,
                completes: p.completes + (choice === "complete" ? 1 : 0),
                drinks: p.drinks + (choice === "drink" ? 1 : 0),
              }
            : p,
        );

        const isLastInRound = turnIndex >= roundOrder.length - 1;
        if (!isLastInRound) {
          set({
            players: nextPlayers,
            turnIndex: turnIndex + 1,
            phase: "turn",
            currentKind: null,
            currentText: null,
          });
          return;
        }

        if (round >= TOTAL_ROUNDS) {
          set({
            players: nextPlayers,
            phase: "results",
            currentKind: null,
            currentText: null,
          });
          return;
        }

        set({
          players: nextPlayers,
          phase: "roundComplete",
          currentKind: null,
          currentText: null,
        });
      },

      continueAfterRound: () => {
        const { players, round } = get();
        set(startRound(players, round + 1));
      },

      playAgain: () => {
        const { players } = get();
        set({
          players: players.map((p) => ({ ...p, completes: 0, drinks: 0 })),
          usedTruths: [],
          usedDares: [],
          ...startRound(players, 1),
        });
      },

      newGame: () => {
        set({
          players: [],
          phase: "setup",
          round: 1,
          roundOrder: [],
          turnIndex: 0,
          currentKind: null,
          currentText: null,
          usedTruths: [],
          usedDares: [],
        });
      },
    }),
    {
      name: "do-or-drink-v1",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export const TOTAL_GAME_ROUNDS = TOTAL_ROUNDS;

export function currentPlayer(state: GameState): Player | undefined {
  const id = state.roundOrder[state.turnIndex];
  return state.players.find((p) => p.id === id);
}

export function rankedPlayers(players: Player[]) {
  return [...players].sort((a, b) => b.completes - a.completes || a.drinks - b.drinks);
}

export function winners(players: Player[]) {
  if (players.length === 0) {
    return { fearless: [] as Player[], wuss: [] as Player[] };
  }
  const maxComplete = Math.max(...players.map((p) => p.completes));
  const maxDrink = Math.max(...players.map((p) => p.drinks));
  return {
    fearless: players.filter((p) => p.completes === maxComplete),
    wuss: players.filter((p) => p.drinks === maxDrink),
  };
}
