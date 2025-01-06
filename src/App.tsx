import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokemonDetails from "./pages/PokemonDetails";
import ScrollToTopWrapper from "./components/ScrollToTopWrapper";

const App: React.FC = () => (
  <Router basename="/pokemon-team-builder">
    <ScrollToTopWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetails />} />
      </Routes>
    </ScrollToTopWrapper>
  </Router>
);

export default App;
