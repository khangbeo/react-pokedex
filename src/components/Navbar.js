import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemon = async () => {
            if (searchQuery.length >= 2) {
                setIsLoading(true);
                try {
                    const response = await fetch(
                        `https://pokeapi.co/api/v2/pokemon?limit=1118`
                    );
                    const data = await response.json();
                    const filteredPokemon = data.results
                        .filter((pokemon) =>
                            pokemon.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 5);
                    setSearchResults(filteredPokemon);
                    setShowResults(true);
                } catch (error) {
                    console.error("Error fetching Pokemon:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        };

        const timeoutId = setTimeout(fetchPokemon, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/pokemon/${searchQuery.toLowerCase()}`);
            setSearchQuery("");
            setShowResults(false);
        }
    };

    const handleResultClick = (pokemonName) => {
        navigate(`/pokemon/${pokemonName}`);
        setSearchQuery("");
        setShowResults(false);
    };

    return (
        <nav className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                            alt="Pokeball"
                            className="w-8 h-8"
                        />
                        <span className="text-2xl font-bold text-white hover:text-red-100 transition-colors duration-200">
                            Pokédex
                        </span>
                    </Link>

                    <div className="relative flex-1 max-w-xl mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search Pokémon..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </form>

                        {showResults && (
                            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                                {isLoading ? (
                                    <div className="px-4 py-2 text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                            <span>Searching...</span>
                                        </div>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((pokemon) => (
                                        <button
                                            key={pokemon.name}
                                            onClick={() =>
                                                handleResultClick(pokemon.name)
                                            }
                                            className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize flex items-center space-x-2"
                                        >
                                            <img
                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                                                    pokemon.url
                                                        .split("/")
                                                        .slice(-2, -1)[0]
                                                }.png`}
                                                alt={pokemon.name}
                                                className="w-6 h-6"
                                            />
                                            <span>{pokemon.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">
                                        No Pokémon found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
