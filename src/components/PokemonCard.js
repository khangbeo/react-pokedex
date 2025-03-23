import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PokemonCard({ pokemon, onCompare, isSelected }) {
    const pokemonId = pokemon.url.split("/").slice(-2, -1)[0];
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [pokemonId]);

    return (
        <div className="relative">
            <Link
                to={`/pokemon/${pokemonId}`}
                className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
                <div className="p-4">
                    <div className="relative w-full h-48 mb-4">
                        {imageError ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <p className="text-gray-500 text-center">
                                    No image available
                                </p>
                            </div>
                        ) : (
                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                                alt={pokemon.name}
                                className="w-full h-full object-contain"
                                onError={() => {
                                    setImageError(true);
                                }}
                            />
                        )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 capitalize text-center">
                        {pokemon.name}
                    </h2>
                </div>
            </Link>
            <button
                onClick={() => onCompare(pokemon)}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                    isSelected
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-600 hover:bg-red-100"
                } transition-colors duration-200`}
                aria-label="Compare Pokemon"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                </svg>
            </button>
        </div>
    );
}
