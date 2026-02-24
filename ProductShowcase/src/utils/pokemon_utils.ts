export function extractPokemonId(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  if (!match) return 0;
  return Number(match[1]);
}

export function pad3(n: number): string {
  return String(n).padStart(3, "0");
}

export function getOfficialArtworkById(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function typeColor(type: string) {
  if (type === "grass") return "bg-green-500";
  if (type === "poison") return "bg-purple-500";
  if (type === "fire") return "bg-orange-500";
  if (type === "water") return "bg-blue-500";
  if (type === "electric") return "bg-yellow-400 text-slate-900";
  return "bg-slate-600";
}