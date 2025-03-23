import { useState, useEffect } from "react";

export default function CompareModal({ pokemon1, pokemon2, onClose }) {
    const [pokemon1Data, setPokemon1Data] = useState(null);
    const [pokemon2Data, setPokemon2Data] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonData = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch(pokemon1.url),
                    fetch(pokemon2.url),
                ]);
                const [data1, data2] = await Promise.all([
                    res1.json(),
                    res2.json(),
                ]);
                setPokemon1Data(data1);
                setPokemon2Data(data2);
            } catch (error) {
                console.error("Error fetching Pokemon data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonData();
    }, [pokemon1, pokemon2]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!pokemon1Data || !pokemon2Data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Compare Pokémon
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Pokemon 1 */}
                        <div className="text-center">
                            <img
                                src={
                                    pokemon1Data.sprites.other[
                                        "official-artwork"
                                    ].front_default
                                }
                                alt={pokemon1Data.name}
                                className="w-48 h-48 mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold capitalize mb-4">
                                {pokemon1Data.name}
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Height:</span>{" "}
                                    {pokemon1Data.height / 10}m
                                </p>
                                <p>
                                    <span className="font-medium">Weight:</span>{" "}
                                    {pokemon1Data.weight / 10}kg
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Base Experience:
                                    </span>{" "}
                                    {pokemon1Data.base_experience}
                                </p>
                                <div>
                                    <span className="font-medium">Types:</span>{" "}
                                    {pokemon1Data.types
                                        .map((type) => type.type.name)
                                        .join(", ")}
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Abilities:
                                    </span>{" "}
                                    {pokemon1Data.abilities
                                        .map((ability) => ability.ability.name)
                                        .join(", ")}
                                </div>
                            </div>
                        </div>

                        {/* Pokemon 2 */}
                        <div className="text-center">
                            <img
                                src={
                                    pokemon2Data.sprites.other[
                                        "official-artwork"
                                    ].front_default
                                }
                                alt={pokemon2Data.name}
                                className="w-48 h-48 mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold capitalize mb-4">
                                {pokemon2Data.name}
                            </h3>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-medium">Height:</span>{" "}
                                    {pokemon2Data.height / 10}m
                                </p>
                                <p>
                                    <span className="font-medium">Weight:</span>{" "}
                                    {pokemon2Data.weight / 10}kg
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Base Experience:
                                    </span>{" "}
                                    {pokemon2Data.base_experience}
                                </p>
                                <div>
                                    <span className="font-medium">Types:</span>{" "}
                                    {pokemon2Data.types
                                        .map((type) => type.type.name)
                                        .join(", ")}
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Abilities:
                                    </span>{" "}
                                    {pokemon2Data.abilities
                                        .map((ability) => ability.ability.name)
                                        .join(", ")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
