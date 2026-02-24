import { Link, useLocation } from "react-router-dom";
import { usePokemonTeam } from "../context/PokemonTeamContext";
import { pad3 } from "../utils/pokemon_utils";

export default function PokemonTeamBar() {
  const { team, removePokemon, clearTeam } = usePokemonTeam();
  const location = useLocation();

  if (team.length === 0) return null;

  return (
    <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-extrabold text-slate-800">Time Pokémon</div>
          <div className="text-xs font-semibold text-slate-500">
            ({team.length}/6)
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-3 overflow-x-auto px-2">
          {team.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1"
            >
              <Link
                to={`/pokemon/${p.name}`}
                state={{ backgroundLocation: location, pokemonId: p.id }}
                className="flex items-center gap-2"
                title={p.name}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-8 w-8 object-contain"
                />
                <div className="text-xs font-bold capitalize text-slate-700 whitespace-nowrap">
                  {p.name} <span className="text-slate-300">#{pad3(p.id)}</span>
                </div>
              </Link>

              <button
                onClick={() => removePokemon(p.id)}
                className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-50"
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={clearTeam}
          className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
        >
          Limpar time
        </button>
      </div>
    </div>
  );
}