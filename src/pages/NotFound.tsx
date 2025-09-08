import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const angryPokemonList = [
  "gengar",
  "charizard",
  "gyarados",
  "mewtwo",
  "scrafty",
  "primeape",
  "incineroar",
  "pangoro",
  "tyranitar",
  "croagunk",
];

const getRandomAngryPokemon = () => {
  const idx = Math.floor(Math.random() * angryPokemonList.length);
  return angryPokemonList[idx];
};

const NotFound: React.FC = () => {
  const [sprite, setSprite] = useState<string>("");
  const [pokemonName, setPokemonName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = getRandomAngryPokemon();
    setPokemonName(name);
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => res.json())
      .then((data) => setSprite(data.sprites.other["official-artwork"].front_default));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Ops! Not Found Error 404</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        This page doesn't exist.<br />
        Looks like you made a wild {pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)} angry!
      </p>
      {sprite && (
        <img
          src={sprite}
          alt={pokemonName}
          className="w-64 h-64 object-contain mb-6"
          style={{ filter: "brightness(0.85) contrast(1.2)" }}
        />
      )}
      <button
        onClick={() => navigate("/")}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow transition"
      >
        Go back to Home
      </button>
    </div>
  );
};

export default NotFound;