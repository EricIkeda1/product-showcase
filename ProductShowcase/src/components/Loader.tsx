export default function Loader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
      <span className="text-sm">{label}</span>
    </div>
  );
}