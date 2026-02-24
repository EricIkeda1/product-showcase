import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TeamPokemon = {
  id: number;
  name: string;
  image: string;
};

type PokemonTeamContextValue = {
  team: TeamPokemon[];
  isFull: boolean;
  hasPokemon: (id: number) => boolean;
  togglePokemon: (p: TeamPokemon) => boolean;
  removePokemon: (id: number) => void;
  clearTeam: () => void;
  refreshTeam: () => Promise<void>;
};

const PokemonTeamContext = createContext<PokemonTeamContextValue | null>(null);

const TEAM_KEY = "pokedex_team_v1";

function loadTeam(): TeamPokemon[] {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TeamPokemon[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveTeam(team: TeamPokemon[]) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

export function PokemonTeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<TeamPokemon[]>(() => loadTeam());

  useEffect(() => {
    saveTeam(team);
  }, [team]);

  const value = useMemo(() => {
    const isFull = team.length >= 6;

    function hasPokemon(id: number) {
      return team.some((t) => t.id === id);
    }

    function togglePokemon(p: TeamPokemon) {
      if (hasPokemon(p.id)) {
        setTeam((prev) => prev.filter((t) => t.id !== p.id));
        return true;
      }
      if (team.length >= 6) return false;
      setTeam((prev) => [...prev, p]);
      return true;
    }

    function removePokemon(id: number) {
      setTeam((prev) => prev.filter((t) => t.id !== id));
    }

    function clearTeam() {
      setTeam([]);
    }

    async function refreshTeam() {
      setTeam((prev) => [...prev]);
    }

    return { team, isFull, hasPokemon, togglePokemon, removePokemon, clearTeam, refreshTeam };
  }, [team]);

  return <PokemonTeamContext.Provider value={value}>{children}</PokemonTeamContext.Provider>;
}

export function usePokemonTeam() {
  const ctx = useContext(PokemonTeamContext);
  if (!ctx) throw new Error("usePokemonTeam precisa estar dentro de PokemonTeamProvider");
  return ctx;
}