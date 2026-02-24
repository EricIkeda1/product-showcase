import axios from "axios";
import type { PokemonListItem, PokemonDetails } from "../types/pokemon_types";
import { cacheGet, cacheSet } from "../utils/cache";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

const TTL_LIST = 1000 * 60 * 60 * 24;
const TTL_DETAILS = 1000 * 60 * 60 * 24;

export async function getPokemonList(
  limit = 151,
  forceRefresh = false
): Promise<PokemonListItem[]> {
  const key = `pokedex:list:${limit}`;

  if (!forceRefresh) {
    const cached = cacheGet<PokemonListItem[]>(key);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return cached;
    }
  }

  try {
    const res = await api.get(`/pokemon`, { params: { limit } });
    const data = res.data;
    
    if (!data || !data.results || !Array.isArray(data.results)) {
      throw new Error("Formato de resposta inválido");
    }
    
    const results = data.results;
    
    const formattedResults = results.map((item: any) => ({
      name: item.name,
      url: item.url
    }));
    
    cacheSet(key, formattedResults, TTL_LIST);
    return formattedResults;
  } catch (error) {
    console.error("Erro ao buscar lista de pokémons:", error);
    throw error;
  }
}

export async function getPokemonByName(
  name: string,
  forceRefresh = false
): Promise<PokemonDetails> {
  const safeName = encodeURIComponent(name.toLowerCase());
  const key = `pokedex:details:name:${safeName}`;

  if (!forceRefresh) {
    const cached = cacheGet<PokemonDetails>(key);
    if (cached) return cached;
  }

  try {
    const res = await api.get(`/pokemon/${safeName}`);
    const data = res.data;
    
    if (!data || !data.id) {
      throw new Error("Dados do Pokémon inválidos");
    }
    
    cacheSet(key, data, TTL_DETAILS);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar Pokémon ${name}:`, error);
    throw error;
  }
}

export async function getPokemonById(
  id: number,
  forceRefresh = false
): Promise<PokemonDetails> {
  const key = `pokedex:details:id:${id}`;

  if (!forceRefresh) {
    const cached = cacheGet<PokemonDetails>(key);
    if (cached) return cached;
  }

  try {
    const res = await api.get(`/pokemon/${id}`);
    const data = res.data;
    
    if (!data || !data.id) {
      throw new Error("Dados do Pokémon inválidos");
    }
    
    cacheSet(key, data, TTL_DETAILS);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
    throw error;
  }
}