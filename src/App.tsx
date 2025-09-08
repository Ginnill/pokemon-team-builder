import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetails from "./pages/PokemonDetails";
import ScrollToTopWrapper from "./components/ScrollToTopWrapper";
import { PokemonProvider } from "./context/PokemonContext"; // importe o provider
import NotFound from "./pages/NotFound";

const App: React.FC = () => (
  <Router>
    <PokemonProvider>
      <ScrollToTopWrapper>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </ScrollToTopWrapper>
    </PokemonProvider>
  </Router>
);

export default App;
