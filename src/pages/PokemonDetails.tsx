import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPokemonDetails, getPokemonSpecies } from "../api/pokeApi";

interface PokemonDetailsProps {
  name: string;
  id: number;
  sprites: { front_default: string };
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
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

const calculateTypeDefenses = (types: { type: { name: string } }[]) => {
  const typeChart: { [key: string]: { [key: string]: number } } = {
    normal: { fighting: 2, ghost: 0 },
    fire: {
      fire: 0.5,
      water: 2,
      grass: 0.5,
      ice: 0.5,
      bug: 0.5,
      rock: 2,
      steel: 0.5,
    },
    water: {
      fire: 0.5,
      water: 0.5,
      grass: 2,
      electric: 2,
      ice: 0.5,
      steel: 0.5,
    },
    electric: { electric: 0.5, ground: 2, flying: 0.5, steel: 0.5 },
    grass: {
      fire: 2,
      water: 0.5,
      grass: 0.5,
      ice: 2,
      poison: 2,
      ground: 0.5,
      flying: 2,
      bug: 2,
    },
    ice: { fire: 2, ice: 0.5, fighting: 2, rock: 2, steel: 2 },
    fighting: {
      flying: 2,
      psychic: 2,
      bug: 0.5,
      rock: 0.5,
      dark: 0.5,
      fairy: 2,
    },
    poison: {
      grass: 0.5,
      fighting: 0.5,
      poison: 0.5,
      ground: 2,
      psychic: 2,
      bug: 0.5,
      fairy: 0.5,
    },
    ground: { water: 2, grass: 2, ice: 2, electric: 0, poison: 0.5, rock: 0.5 },
    flying: {
      electric: 2,
      rock: 2,
      ice: 2,
      ground: 0,
      grass: 0.5,
      fighting: 0.5,
      bug: 0.5,
    },
    psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
    bug: {
      fire: 2,
      grass: 0.5,
      fighting: 0.5,
      ground: 0.5,
      flying: 2,
      rock: 2,
    },
    rock: {
      water: 2,
      grass: 2,
      fighting: 2,
      ground: 2,
      normal: 0.5,
      fire: 0.5,
      poison: 0.5,
      flying: 0.5,
    },
    ghost: { ghost: 2, dark: 2, normal: 0, fighting: 0 },
    dragon: {
      fire: 0.5,
      water: 0.5,
      grass: 0.5,
      electric: 0.5,
      ice: 2,
      dragon: 2,
      fairy: 2,
    },
    dark: { fighting: 2, bug: 2, fairy: 2, psychic: 0, ghost: 0.5, dark: 0.5 },
    steel: {
      normal: 0.5,
      fire: 2,
      grass: 0.5,
      ice: 0.5,
      fighting: 2,
      poison: 0,
      ground: 2,
      flying: 0.5,
      psychic: 0.5,
      bug: 0.5,
      rock: 0.5,
      dragon: 0.5,
      steel: 0.5,
      fairy: 0.5,
    },
    fairy: {
      fighting: 0.5,
      poison: 2,
      steel: 2,
      dragon: 0,
      dark: 0.5,
      bug: 0.5,
    },
  };

  const defenseChart: { [key: string]: number } = {};

  // Combinar os tipos
  types.forEach(({ type }) => {
    const typeDefenses = typeChart[type.name];
    if (typeDefenses) {
      Object.entries(typeDefenses).forEach(([key, value]) => {
        defenseChart[key] = (defenseChart[key] || 1) * value;
      });
    }
  });

  // Transformar o resultado em array para exibição
  return Object.entries(defenseChart).map(([type, multiplier]) => ({
    type,
    multiplier,
  }));
};

const PokemonDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailsProps | null>(null);
  const [description, setDescription] = useState<string>("");
  const [evolutions, setEvolutions] = useState<any[]>([]);

  const MAX_POKEMON_ID = 1025; // Último ID conhecido
  const formatId = (id: number) => `Nº ${String(id).padStart(4, "0")}`; // Formatar com 4 dígitos

  useEffect(() => {
    if (name) {
      getPokemonDetails(name).then(setPokemon);
      getPokemonSpecies(name).then((data) => {
        const englishEntry = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === "en"
        );
        setDescription(englishEntry?.flavor_text || "");

        // Obter cadeia evolutiva
        fetch(data.evolution_chain.url)
          .then((res) => res.json())
          .then((evolutionData) => {
            const evolutionChain: any[] = [];
            let current = evolutionData.chain;

            while (current) {
              evolutionChain.push({
                name: current.species.name,
                url: current.species.url,
              });
              current = current.evolves_to[0];
            }

            Promise.all(
              evolutionChain.map(async (evo) => {
                const details = await getPokemonDetails(evo.name);
                return {
                  name: evo.name,
                  id: details.id,
                  sprite: details.sprites.front_default,
                  types: details.types.map((type) => type.type.name),
                };
              })
            ).then(setEvolutions);
          });
      });
    }
  }, [name]);

  if (!pokemon) return <p>Loading...</p>;

  const previousId = pokemon.id === 1 ? MAX_POKEMON_ID : pokemon.id - 1;
  const nextId = pokemon.id === MAX_POKEMON_ID ? 1 : pokemon.id + 1;

  return (
    <div className="max-w-[720px] mx-auto px-5">
      {/* Navegação */}
      <div className="grid grid-cols-2 gap-5 mb-5 text-center py-3 bg-gray-900 rounded-md mt-5">
        <Link to={`/pokemon/${previousId}`} className="text-white">
          &lt; {formatId(previousId)}
        </Link>
        <Link to={`/pokemon/${nextId}`} className="text-white">
          {formatId(nextId)} &gt;
        </Link>
      </div>

      {/* Informações do Pokémon */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
        <p>{formatId(pokemon.id)}</p>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 mx-auto border-solid border-[5px] mt-2 border-white rounded-full bg-gray-300"
        />

        {/* Tipagem do Pokémon */}
        <div className="flex justify-center space-x-2 mt-3">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold capitalize`}
              style={{
                backgroundColor: getTypeColor(type.type.name),
              }}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h2 className="text-xl font-bold mb-3">Stats</h2>
        <ul className="space-y-3">
          {pokemon.stats.map((stat) => (
            <li
              key={stat.stat.name}
              className="flex items-center justify-between"
            >
              {/* Nome do Stat */}
              <span className="capitalize w-1/4 text-left">
                {stat.stat.name}
              </span>

              {/* Barra de Progresso */}
              <div className="flex items-center w-3/4">
                <span className="text-sm text-gray-800 w-10 text-right mr-2">
                  0
                </span>
                <div className="relative w-full h-4 bg-gray-200 rounded-lg">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-lg"
                    style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-700 w-10 text-left ml-2">
                  255
                </span>
              </div>

              {/* Valor do Stat */}
              <span className="ml-4 font-bold">{stat.base_stat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h2 className="text-xl font-bold mb-3">Additional Info</h2>
        <p>
          <strong>Height:</strong> {pokemon.height} decimetres
        </p>
        <p>
          <strong>Weight:</strong> {pokemon.weight} hectograms
        </p>
        <p>
          <strong>Types:</strong>{" "}
          {pokemon.types.map((type) => type.type.name).join(", ")}
        </p>
        <p>
          <strong>Abilities:</strong>{" "}
          {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
        </p>
      </div>

      {/* Descrição */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p>{description}</p>
      </div>

      {/* Type Defenses */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h2 className="text-xl font-bold mb-3">Type Defenses</h2>
        <p className="mb-3 text-sm text-gray-600">
          How much damage this Pokémon takes from each type.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {calculateTypeDefenses(pokemon.types).map(({ type, multiplier }) => (
            <div
              key={type}
              className={`flex flex-col items-center justify-center p-3 rounded-lg text-white font-semibold capitalize`}
              style={{
                backgroundColor: getTypeColor(type),
              }}
            >
              <span>{type}</span>
              <span className="text-lg">{multiplier}x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evoluções */}
      <div className="bg-gray-100 p-5 rounded-lg mb-5 text-center">
        <h2 className="text-xl font-bold mb-3">Evolutions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {evolutions.map((evo) => (
            <div key={evo.id} className="text-center">
              <img
                src={evo.sprite}
                alt={evo.name}
                className="w-20 h-20 mx-auto border-2 border-gray-300 rounded-full"
              />
              <p className="capitalize">{evo.name}</p>
              <p>{formatId(evo.id)}</p>
              <p className="text-sm text-gray-600">{evo.types.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center my-10">
        <Link
          to="/"
          className="text-white py-2 px-10 bg-orange-500 hover:bg-orange-600 transition-colors rounded-md"
        >
          Explore more Pokémon
        </Link>
      </div>
    </div>
  );
};

export default PokemonDetails;
