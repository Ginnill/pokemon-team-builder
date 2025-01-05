import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPokemonList, getPokemonDetails } from "../api/pokeApi";
import PokemonCard from "../components/PokemonCard";

const Home: React.FC = () => {
  const [pokemons, setPokemons] = useState<
    { name: string; id: number; types: string[]; sprite: string; stats: number }[]
  >([]);
  const [search, setSearch] = useState("");
  const [allTypes, setAllTypes] = useState<string[]>([]); // Todos os tipos disponíveis
  const [selectedType1, setSelectedType1] = useState<string>("Pokemon Type 1");
  const [selectedType2, setSelectedType2] = useState<string>("Pokemon Type 2");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortCriteria, setSortCriteria] = useState<"name" | "id">("id");
  const navigate = useNavigate();

  // Buscar a lista de Pokémon
  useEffect(() => {
    getPokemonList().then((list) => {
      Promise.all(
        list.map(async (pokemon: { name: string }) => {
          const details = await getPokemonDetails(pokemon.name);
          const statsSum = details.stats.reduce((acc: number, stat: any) => acc + stat.base_stat, 0);
          return {
            name: pokemon.name,
            id: details.id, // Adiciona o ID do Pokémon
            types: details.types.map((typeInfo: any) => typeInfo.type.name),
            sprite: details.sprites.front_default,
            stats: statsSum,
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
  const filteredPokemons = pokemons
    .filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(search.toLowerCase());
      const matchesType1 = selectedType1 === "Pokemon Type 1" || pokemon.types.includes(selectedType1);
      const matchesType2 = selectedType2 === "Pokemon Type 2" || pokemon.types.includes(selectedType2);

      return matchesSearch && matchesType1 && matchesType2;
    })
    .sort((a, b) => {
      if (sortCriteria === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
    });

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

      {/* Selects para selecionar tipos */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={selectedType1}
          onChange={(e) => setSelectedType1(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="Pokemon Type 1">Pokemon Type 1</option>
          {allTypes.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedType2}
          onChange={(e) => setSelectedType2(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="Pokemon Type 2">Pokemon Type 2</option>
          {allTypes.map((type) => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Filtros adicionais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border rounded p-2"
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>

          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value as "name" | "id")}
            className="border rounded p-2"
          >
            <option value="name">Sort by Name</option>
            <option value="id">Sort by Pokedex Number</option>
          </select>
        </div>
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
