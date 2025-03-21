import React, { useState, useEffect } from 'react';

const PokemonApp = () => {
  const [pokemon, setPokemon] = useState(null);
  const [pokemonId, setPokemonId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPokemon(pokemonId);
  }, [pokemonId]);

  const fetchPokemon = async (idOrName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Pokémon not found!');
      }

      const data = await response.json();
      setPokemon(data);
      setPokemonId(data.id);
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchPokemon(searchTerm);
    }
  };

  const handlePrevious = () => {
    if (pokemonId > 1) {
      setPokemonId(pokemonId - 1);
    }
  };

  const handleNext = () => {
    setPokemonId(pokemonId + 1);
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Pokémon Info App</h1>
      
      <div className="w-full max-w-md mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Pokémon name or ID"
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        </form>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handlePrevious}
          disabled={pokemonId <= 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={handleNext}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      
      {loading && <p className="text-gray-600">Loading...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {pokemon && !loading && (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-4">
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-48 h-48 object-contain"
            />
            <h2 className="text-2xl font-bold mt-2">
              #{pokemon.id} {capitalize(pokemon.name)}
            </h2>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Types</h3>
            <div className="flex gap-2">
              {pokemon.types.map(type => (
                <span 
                  key={type.type.name}
                  className="px-3 py-1 rounded text-white bg-blue-500"
                >
                  {capitalize(type.type.name)}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold mb-2">Stats</h3>
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name} className="mb-2">
                <div className="flex justify-between mb-1">
                  <span>{capitalize(stat.stat.name.replace('-', ' '))}</span>
                  <span>{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="font-bold mb-2">Abilities</h3>
            <ul className="list-disc pl-5">
              {pokemon.abilities.map(ability => (
                <li key={ability.ability.name}>
                  {capitalize(ability.ability.name.replace('-', ' '))}
                  {ability.is_hidden && <span className="text-gray-500 ml-2">(Hidden)</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonApp;
