import PokemonCard from "./PokemonCard"

export default function PokemonList({ pokemon }) {
    return (
        <div className="flex flex-wrap justify-center">
            {pokemon.map(p => (
                <PokemonCard key={p} p={p} />
            ))}
        </div>
    )
}

