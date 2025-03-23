import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CardDetail() {
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moves, setMoves] = useState([]);
    const [evolutionChain, setEvolutionChain] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${id}`
                );
                if (!response.ok) {
                    throw new Error("Pokemon not found");
                }
                const data = await response.json();
                setPokemon(data);

                // Fetch species data
                const speciesResponse = await fetch(data.species.url);
                const speciesData = await speciesResponse.json();
                setSpecies(speciesData);

                // Fetch evolution chain
                if (speciesData.evolution_chain?.url) {
                    const evolutionResponse = await fetch(
                        speciesData.evolution_chain.url
                    );
                    const evolutionData = await evolutionResponse.json();
                    setEvolutionChain(evolutionData);
                }

                // Fetch and sort moves
                const movesData = await Promise.all(
                    data.moves.map(async (move) => {
                        const moveResponse = await fetch(move.move.url);
                        const moveData = await moveResponse.json();
                        return {
                            ...moveData,
                            level_learned_at:
                                move.version_group_details[0].level_learned_at,
                        };
                    })
                );
                setMoves(
                    movesData
                        .filter((move) => move.level_learned_at > 0)
                        .sort((a, b) => a.level_learned_at - b.level_learned_at)
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Pokemon not found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The Pokemon you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!pokemon) return null;

    const renderEvolutionChain = (chain) => {
        if (!chain) return null;

        const evolutionItems = [];
        let current = chain.chain;

        while (current) {
            const pokemonId = current.species.url.split("/").slice(-2, -1)[0];
            evolutionItems.push({
                id: pokemonId,
                name: current.species.name,
                trigger: current.evolution_details[0]?.trigger?.name || null,
            });
            current = current.evolves_to[0];
        }

        if (evolutionItems.length <= 1) return null;

        return (
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Evolution Chain
                </h2>
                <div className="flex items-center justify-center gap-4">
                    {evolutionItems.map((item, index) => (
                        <div key={item.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`}
                                    alt={item.name}
                                    className="w-16 h-16 object-contain"
                                />
                                <span className="text-sm font-medium capitalize mt-1">
                                    {item.name}
                                </span>
                            </div>
                            {index < evolutionItems.length - 1 && (
                                <div className="flex flex-col items-center mx-2">
                                    <span className="text-xs text-gray-500 capitalize">
                                        {evolutionItems[index + 1].trigger}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
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
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                Back
            </button>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-full md:w-1/3">
                            <div className="flex flex-col items-center">
                                <div className="relative w-48 h-48 mb-4">
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                                        alt={pokemon.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                                        }}
                                    />
                                </div>
                                <h1 className="text-4xl font-bold capitalize mb-2">
                                    {pokemon.name}
                                </h1>
                            </div>
                            <div className="flex gap-2 mb-6">
                                {pokemon.types.map((type) => (
                                    <span
                                        key={type.type.name}
                                        className={`px-3 py-1 rounded-full text-white text-sm font-medium capitalize ${
                                            type.type.name === "fire"
                                                ? "bg-red-500"
                                                : type.type.name === "water"
                                                ? "bg-blue-500"
                                                : type.type.name === "grass"
                                                ? "bg-green-500"
                                                : type.type.name === "electric"
                                                ? "bg-yellow-500"
                                                : type.type.name === "psychic"
                                                ? "bg-purple-500"
                                                : type.type.name === "ice"
                                                ? "bg-blue-300"
                                                : type.type.name === "dragon"
                                                ? "bg-indigo-500"
                                                : type.type.name === "dark"
                                                ? "bg-gray-800"
                                                : type.type.name === "fairy"
                                                ? "bg-pink-500"
                                                : type.type.name === "normal"
                                                ? "bg-gray-500"
                                                : type.type.name === "fighting"
                                                ? "bg-red-700"
                                                : type.type.name === "flying"
                                                ? "bg-blue-400"
                                                : type.type.name === "poison"
                                                ? "bg-purple-600"
                                                : type.type.name === "ground"
                                                ? "bg-yellow-600"
                                                : type.type.name === "rock"
                                                ? "bg-yellow-800"
                                                : type.type.name === "bug"
                                                ? "bg-green-600"
                                                : type.type.name === "ghost"
                                                ? "bg-indigo-600"
                                                : type.type.name === "steel"
                                                ? "bg-gray-400"
                                                : "bg-gray-500"
                                        }`}
                                    >
                                        {type.type.name}
                                    </span>
                                ))}
                            </div>

                            {/* Add Evolution Chain before Characteristics */}
                            {renderEvolutionChain(evolutionChain)}

                            {/* Characteristics Section */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Characteristics
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Species
                                        </p>
                                        <p className="text-lg font-semibold capitalize">
                                            {species?.genera?.find(
                                                (g) => g.language.name === "en"
                                            )?.genus || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Color
                                        </p>
                                        <p className="text-lg font-semibold capitalize">
                                            {species?.color?.name || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Egg Groups
                                        </p>
                                        <p className="text-lg font-semibold capitalize">
                                            {species?.egg_groups
                                                ?.map((group) => group.name)
                                                .join(", ") || "Unknown"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Gender Rate
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {species?.gender_rate === -1
                                                ? "Genderless"
                                                : species?.gender_rate === 0
                                                ? "100% Male"
                                                : species?.gender_rate === 8
                                                ? "100% Female"
                                                : `${
                                                      ((8 -
                                                          species?.gender_rate) /
                                                          8) *
                                                      100
                                                  }% Male, ${
                                                      (species?.gender_rate /
                                                          8) *
                                                      100
                                                  }% Female`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Height
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {pokemon.height / 10}m
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Weight
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {pokemon.weight / 10}kg
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Base Experience
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {pokemon.base_experience}
                                    </p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Abilities
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {pokemon.abilities.map((ability) => (
                                        <span
                                            key={ability.ability.name}
                                            className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm font-medium capitalize"
                                        >
                                            {ability.ability.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Base Stats
                                </h2>
                                <div className="space-y-2">
                                    {pokemon.stats.map((stat) => (
                                        <div key={stat.stat.name}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {stat.stat.name}
                                                </span>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {stat.base_stat}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-red-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            (stat.base_stat /
                                                                255) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    Moves
                                </h2>
                                <div className="h-[400px] overflow-y-auto relative">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Level
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Move
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Class
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Power
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    Acc
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                                    PP
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {moves.map((move) => (
                                                <tr
                                                    key={move.name}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {move.level_learned_at}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                        {move.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs text-white capitalize ${
                                                                move.type
                                                                    .name ===
                                                                "fire"
                                                                    ? "bg-red-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "water"
                                                                    ? "bg-blue-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "grass"
                                                                    ? "bg-green-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "electric"
                                                                    ? "bg-yellow-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "psychic"
                                                                    ? "bg-purple-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "ice"
                                                                    ? "bg-blue-300"
                                                                    : move.type
                                                                          .name ===
                                                                      "dragon"
                                                                    ? "bg-indigo-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "dark"
                                                                    ? "bg-gray-800"
                                                                    : move.type
                                                                          .name ===
                                                                      "fairy"
                                                                    ? "bg-pink-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "normal"
                                                                    ? "bg-gray-500"
                                                                    : move.type
                                                                          .name ===
                                                                      "fighting"
                                                                    ? "bg-red-700"
                                                                    : move.type
                                                                          .name ===
                                                                      "flying"
                                                                    ? "bg-blue-400"
                                                                    : move.type
                                                                          .name ===
                                                                      "poison"
                                                                    ? "bg-purple-600"
                                                                    : move.type
                                                                          .name ===
                                                                      "ground"
                                                                    ? "bg-yellow-600"
                                                                    : move.type
                                                                          .name ===
                                                                      "rock"
                                                                    ? "bg-yellow-800"
                                                                    : move.type
                                                                          .name ===
                                                                      "bug"
                                                                    ? "bg-green-600"
                                                                    : move.type
                                                                          .name ===
                                                                      "ghost"
                                                                    ? "bg-indigo-600"
                                                                    : move.type
                                                                          .name ===
                                                                      "steel"
                                                                    ? "bg-gray-400"
                                                                    : "bg-gray-500"
                                                            }`}
                                                        >
                                                            {move.type.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                        {move.damage_class.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {move.power}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {move.accuracy}%
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {move.pp}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
