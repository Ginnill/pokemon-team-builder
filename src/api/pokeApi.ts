import axios from "axios";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
});

// Obter a lista completa de Pokémon
export const getPokemonList = async () => {
  const response = await api.get("pokemon?limit=1100&offset=0");
  return response.data.results;
};

// Obter os detalhes de um Pokémon
export const getPokemonDetails = async (name: string) => {
  const response = await api.get(`pokemon/${name}`);
  return response.data;
};

// Obter os detalhes de uma espécie de Pokémon (descrições, categorias, etc.)
export const getPokemonSpecies = async (name: string) => {
  const response = await api.get(`pokemon-species/${name}`);
  return response.data;
};
