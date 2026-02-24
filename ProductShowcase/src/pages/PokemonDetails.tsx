import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  type Location,
} from "react-router-dom";
import Loader from "../components/Loader";
import { getPokemonById, getPokemonByName } from "../api/pokemon_service";
import type { PokemonDetails as PokemonDetailsType } from "../types/pokemon_types";
import { getOfficialArtworkById, pad3, typeColor } from "../utils/pokemon_utils";
import { usePokemonTeam } from "../context/PokemonTeamContext";

type DetailsState = {
  backgroundLocation?: Location;
  pokemonId?: number;
} | null;

export default function PokemonDetails() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DetailsState;

  const isModal = !!state?.backgroundLocation;
  const pokemonIdFromState = state?.pokemonId;

  const { togglePokemon, hasPokemon, isFull } = usePokemonTeam();

  const [pokemon, setPokemon] = useState<PokemonDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPokemon() {
      try {
        setLoading(true);
        setError(null);

        if (!name && !pokemonIdFromState) {
          setError("Pokémon inválido.");
          setLoading(false);
          return;
        }

        if (name) {
          try {
            const data = await getPokemonByName(name);
            if (!cancelled) setPokemon(data);
            return;
          } catch {
          }
        }

        if (pokemonIdFromState) {
          const data = await getPokemonById(pokemonIdFromState);
          if (!cancelled) setPokemon(data);
          return;
        }

        throw new Error("Falha ao carregar Pokémon");
      } catch {
        if (!cancelled) setError("Não consegui carregar os detalhes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPokemon();
    return () => {
      cancelled = true;
    };
  }, [name, pokemonIdFromState]);

  if (loading) {
    const box = (
      <div className="rounded-2xl bg-white p-6">
        <Loader label="Carregando detalhes..." />
      </div>
    );

    return isModal ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
        {box}
      </div>
    ) : (
      <div className="p-6">{box}</div>
    );
  }

  if (error || !pokemon) {
    const box = (
      <div className="w-[92vw] max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-red-600">{error ?? "Erro"}</p>
        <button
          onClick={() => (isModal ? navigate(-1) : navigate("/"))}
          className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm text-white"
        >
          Voltar
        </button>
      </div>
    );

    return isModal ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
        {box}
      </div>
    ) : (
      <div className="p-6">{box}</div>
    );
  }

  const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default;
  const heightMeters = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  const id = pokemon.id;
  const teamImage = getOfficialArtworkById(id);
  const isFav = hasPokemon(id);

  const content = (
    <div className="w-[92vw] max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="w-8" />
        
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-extrabold capitalize text-orange-600">
            {pokemon.name}
          </h1>
          <div className="mt-1 text-sm font-semibold text-slate-400">
            #{pad3(pokemon.id)}
          </div>
        </div>

        {isModal ? (
          <button
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Fechar"
            title="Fechar"
          >
            ✕
          </button>
        ) : (
          <div className="w-8" /> 
        )}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() =>
            togglePokemon({
              id: pokemon.id,
              name: pokemon.name,
              image: teamImage,
            })
          }
          className={`rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90 ${
            isFav
              ? "bg-slate-900"
              : isFull
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-red-600"
          }`}
          disabled={!isFav && isFull}
          title={isFull && !isFav ? "Seu time já tem 6 Pokémon" : isFav ? "Remover do time" : "Adicionar ao time"}
        >
          {isFav ? "Remover do time" : "Adicionar ao time"}
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="rounded-2xl bg-slate-50 p-6">
          {artwork ? (
            <img
              src={artwork}
              alt={pokemon.name}
              className="h-44 w-44 object-contain"
            />
          ) : (
            <div className="text-sm text-slate-600">Sem imagem</div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-sm font-semibold text-slate-600">Altura:</span>
          <span className="text-sm font-extrabold text-slate-800">
            {heightMeters} m
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 py-3">
          <span className="text-sm font-semibold text-slate-600">Peso:</span>
          <span className="text-sm font-extrabold text-slate-800">
            {weightKg} kg
          </span>
        </div>

        <div className="pt-3">
          <div className="text-sm font-semibold text-slate-600">Tipos</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`rounded-lg px-4 py-2 text-xs font-bold text-white shadow ${typeColor(
                  t.type.name
                )}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!isModal && (
        <button
          onClick={() => navigate("/")}
          className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Voltar
        </button>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
        onClick={() => navigate(-1)}
      >
        <div onClick={(e) => e.stopPropagation()}>{content}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      {content}
    </div>
  );
}