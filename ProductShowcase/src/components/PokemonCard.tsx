import { pad3 } from "../utils/pokemon_utils";

type Props = {
  id: number;
  name: string;
  image: string;
};

export default function PokemonCard({ id, name, image }: Props) {
  return (
    <div className="w-[220px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-400 hover:shadow-md">
      <div className="rounded-2xl bg-slate-50 p-6">
        <div className="flex items-center justify-center">
          <img src={image} alt={name} className="h-40 w-40 object-contain" />
        </div>
      </div>

      <div className="mt-5 text-center">
        <div className="text-sm font-semibold text-slate-300">
          {id ? `#${pad3(id)}` : ""}
        </div>

        <div className="mt-2 text-lg font-extrabold capitalize text-slate-900">
          {name}
        </div>
      </div>
    </div>
  );
}