import { Routes, Route, Navigate, useLocation, type Location } from "react-router-dom";
import Home from "../pages/Home";
import PokemonDetails from "../pages/PokemonDetails";

export default function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      )}
    </>
  );
}