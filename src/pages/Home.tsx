import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPokemonList, getPokemonDetails } from "../api/pokeApi";
import PokemonCard from "../components/PokemonCard";

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<
    { name: string; id: number; types: string[]; sprite: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [allTypes, setAllTypes] = useState<string[]>([]); // Todos os tipos disponíveis
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Tipos selecionados
  const navigate = useNavigate();

  // Buscar a lista de Pokémon
  useEffect(() => {
    getPokemonList().then((list) => {
      Promise.all(
        list.map(async (pokemon: { name: string }) => {
          const details = await getPokemonDetails(pokemon.name);
          return {
            name: pokemon.name,
            id: details.id, // Adiciona o ID do Pokémon
            types: details.types.map((typeInfo: any) => typeInfo.type.name),
            sprite: details.sprites.front_default,
          };
        })
      ).then(setPokemons);
    });

    // Buscar todos os tipos
    fetch("https://pokeapi.co/api/v2/type/")
      .then((res) => res.json())
      .then((data) => {
        const types = data.results
          .map((type: { name: string }) => type.name)
          .filter((type) => type !== "unknown" && type !== "stellar"); // Filtrar 'unknown'
        setAllTypes(types);
      });
  }, []);

  // Filtrar Pokémon por nome e tipo
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 ||
      selectedTypes.every((type) => pokemon.types.includes(type));
    return matchesSearch && matchesType;
  });

  // Atualizar os tipos selecionados (limite de 2)
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else if (selectedTypes.length < 2) {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="max-w-[1160px] mx-auto px-5 mt-5">
      <h1 className="text-center font-bold text-3xl mb-5">Pokédex</h1>
      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 w-full mb-4"
      />

      {/* Checkboxes para selecionar tipos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {allTypes.map((type) => (
          <label
            key={type}
            className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg cursor-pointer shadow hover:bg-gray-200"
          >
            <input
              type="checkbox"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={() => handleTypeChange(type)}
              className="rounded"
            />
            <span className="capitalize">{type}</span>
          </label>
        ))}
      </div>

      {/* Lista de Pokémon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredPokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            name={pokemon.name}
            id={pokemon.id} // Adiciona o ID
            types={pokemon.types} // Adiciona os tipos
            sprite={pokemon.sprite}
            onClick={() => navigate(`/pokemon/${pokemon.name}`)} // Redirecionar corretamente
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
