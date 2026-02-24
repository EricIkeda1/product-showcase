import AppRoutes from "./routes/AppRoutes";
import { PokemonTeamProvider } from "./context/PokemonTeamContext";
import PokemonTeamBar from "./components/PokemonTeamBar";

export default function App() {
  return (
    <PokemonTeamProvider>
      <AppRoutes />
      <PokemonTeamBar />
    </PokemonTeamProvider>
  );
}