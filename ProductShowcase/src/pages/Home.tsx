import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getPokemonList } from "../api/pokemon_service";
import PokemonCard from "../components/PokemonCard";
import Loader from "../components/Loader";
import type { PokemonListItem } from "../types/pokemon_types";
import { extractPokemonId, getOfficialArtworkById } from "../utils/pokemon_utils";
import { cacheRemoveByPrefix } from "../utils/cache";
import { usePokemonTeam } from "../context/PokemonTeamContext";

export default function Home() {
  const location = useLocation();
  const { refreshTeam } = usePokemonTeam();

  const [list, setList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchData(forceRefresh = false) {
    try {
      setLoading(true);
      setError(null);
      const data = await getPokemonList(151, forceRefresh);
      setList(data);
    } catch {
      setError("Não consegui carregar a lista. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshAll() {
    cacheRemoveByPrefix("pokedex:list:");
    cacheRemoveByPrefix("pokedex:details:");
    await fetchData(true);
    await refreshTeam();
  }

  useEffect(() => {
    fetchData(false);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [list, search]);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border-4 border-slate-800 bg-white">
            <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-slate-800" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-800 bg-white" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-red-600">
              Pokédex
            </h1>
            <p className="text-xs text-slate-500">Gotta catch 'em all!</p>
          </div>
        </div>

        <div className="h-1 w-full bg-red-600" />
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-10 pt-8">
        <div className="mx-auto mb-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-800">
            Explore o mundo Pokémon
          </h2>
          <p className="mt-1 text-sm font-semibold text-red-600">
            Total de pokémons: {list.length || 151}
          </p>
        </div>

        <div className="mx-auto mb-8 flex w-full max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="text-slate-400"
            fill="none"
          >
            <path
              d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pokémon por nome..."
            className="w-full bg-transparent text-sm outline-none"
          />

          <button
            onClick={refreshAll}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            title="Atualizar lista e favoritos"
          >
            Atualizar
          </button>

          {search.trim() !== "" && (
            <button
              onClick={() => setSearch("")}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
            >
              Limpar
            </button>
          )}
        </div>

        {loading && (
          <div className="py-6">
            <Loader label="Buscando Pokémons..." />
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={() => fetchData(true)}
              className="mt-3 block rounded-md bg-red-600 px-3 py-2 text-white hover:opacity-90"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Nenhum pokémon encontrado para <b>{search}</b>.
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid justify-center gap-8 grid-cols-[repeat(auto-fit,220px)]">
            {filtered.map((p) => {
              const id = extractPokemonId(p.url);
              const img = getOfficialArtworkById(id);

              return (
              <Link
                key={p.name}
                to={`/pokemon/${p.name}`}
                state={{ backgroundLocation: location, pokemonId: id }}
                className="block"
              >
                <PokemonCard id={id} name={p.name} image={img} />
              </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}