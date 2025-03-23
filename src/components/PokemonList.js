import PokemonCard from "./PokemonCard";

export default function PokemonList({ pokemon, onCompare, selectedPokemon }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {pokemon.map((p) => (
                <PokemonCard
                    key={p.name}
                    pokemon={p}
                    onCompare={onCompare}
                    isSelected={selectedPokemon.some(
                        (selected) => selected.name === p.name
                    )}
                />
            ))}
        </div>
    );
}
