import { createContext, useContext, useState, ReactNode } from "react";
import { getPokemonList, getPokemonDetails, getPokemonSpecies } from "../api/pokeApi";

interface PokemonCache {
  [name: string]: any;
}

interface SpeciesCache {
  [name: string]: any;
}

interface PokemonContextProps {
  pokemonList: any[];
  getList: () => Promise<any[]>;
  getDetails: (name: string) => Promise<any>;
  getSpecies: (name: string) => Promise<any>;
}

const PokemonContext = createContext<PokemonContextProps | undefined>(undefined);

export const usePokemonContext = () => {
  const context = useContext(PokemonContext);
  if (!context) throw new Error("usePokemonContext must be used within PokemonProvider");
  return context;
};

export const PokemonProvider = ({ children }: { children: ReactNode }) => {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const [detailsCache, setDetailsCache] = useState<PokemonCache>({});
  const [speciesCache, setSpeciesCache] = useState<SpeciesCache>({});

  const getList = async () => {
    if (pokemonList.length > 0) return pokemonList;
    const list = await getPokemonList();
    setPokemonList(list);
    return list;
  };

  const getDetails = async (name: string) => {
    if (detailsCache[name]) return detailsCache[name];
    const details = await getPokemonDetails(name);
    setDetailsCache((prev) => ({ ...prev, [name]: details }));
    return details;
  };

  const getSpecies = async (name: string) => {
    if (speciesCache[name]) return speciesCache[name];
    const species = await getPokemonSpecies(name);
    setSpeciesCache((prev) => ({ ...prev, [name]: species }));
    return species;
  };

  return (
    <PokemonContext.Provider value={{ pokemonList, getList, getDetails, getSpecies }}>
      {children}
    </PokemonContext.Provider>
  );
};