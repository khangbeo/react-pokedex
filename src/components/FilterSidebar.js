import { useState } from "react";

const generations = [
    { id: 1, name: "Kanto", start: 1, end: 151 },
    { id: 2, name: "Johto", start: 152, end: 251 },
    { id: 3, name: "Hoenn", start: 252, end: 386 },
    { id: 4, name: "Sinnoh", start: 387, end: 493 },
    { id: 5, name: "Unova", start: 494, end: 649 },
    { id: 6, name: "Kalos", start: 650, end: 721 },
    { id: 7, name: "Alola", start: 722, end: 809 },
    { id: 8, name: "Galar", start: 810, end: 898 },
];

const types = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
];

export default function FilterSidebar({ onFilterChange }) {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [sortBy, setSortBy] = useState("id");

    const handleTypeChange = (type) => {
        const newTypes = selectedTypes.includes(type)
            ? selectedTypes.filter((t) => t !== type)
            : [...selectedTypes, type];
        setSelectedTypes(newTypes);
        onFilterChange({
            types: newTypes,
            generation: selectedGeneration,
            sortBy,
        });
    };

    const handleGenerationChange = (generation) => {
        const newGeneration =
            selectedGeneration?.id === generation.id ? null : generation;
        setSelectedGeneration(newGeneration);
        onFilterChange({
            types: selectedTypes,
            generation: newGeneration,
            sortBy,
        });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        onFilterChange({
            types: selectedTypes,
            generation: selectedGeneration,
            sortBy: value,
        });
    };

    return (
        <div className="w-64 bg-white p-4 rounded-lg shadow-lg h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Filters
            </h2>

            {/* Sort By */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Sort By
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="id">Pokédex Number</option>
                    <option value="name">Name</option>
                    <option value="height">Height</option>
                    <option value="weight">Weight</option>
                    <option value="base_experience">Base Experience</option>
                </select>
            </div>

            {/* Types */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Types
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {types.map((type) => (
                        <label
                            key={type}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeChange(type)}
                                className="rounded text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm capitalize">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Generations */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Generation
                </h3>
                <div className="space-y-2">
                    {generations.map((gen) => (
                        <label
                            key={gen.id}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="generation"
                                checked={selectedGeneration?.id === gen.id}
                                onChange={() => handleGenerationChange(gen)}
                                className="text-red-500 focus:ring-red-500"
                            />
                            <span className="text-sm">{gen.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
