import React from "react";

interface PokemonCardProps {
  name: string;
  sprite: string;
  id: number;
  types: string[];
  onClick: () => void;
}

const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };
  return typeColors[type] || "#777"; // Retorna uma cor padrão caso o tipo não exista
};

const PokemonCard: React.FC<PokemonCardProps> = ({ name, sprite, id, types, onClick }) => {
  const formatId = (id: number) => `Nº ${String(id).padStart(4, "0")}`; // Formata o ID com 4 dígitos

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gray-100 rounded-lg shadow-md p-4 text-center hover:shadow-lg transition duration-200"
    >

      {/* Número do Pokémon */}
      <p className="text-gray-500 text-sm mb-1">{formatId(id)}</p>

      {/* Imagem */}
      <img src={sprite} alt={name} className="w-28 h-28 mx-auto border-2 p-2 border-gray-200 my-3 bg-white rounded-full" />

      {/* Tipagens */}
      <div className="flex justify-center space-x-2 mb-2">
        {types.map((type) => (
          <span
            key={type}
            className="px-2 py-1 rounded-full text-white text-xs font-semibold capitalize"
            style={{
              backgroundColor: getTypeColor(type),
            }}
          >
            {type}
          </span>
        ))}
      </div>
      
      {/* Nome */}
      <h3 className="text-lg font-bold capitalize">{name}</h3>
    </div>
  );
};

export default PokemonCard;
