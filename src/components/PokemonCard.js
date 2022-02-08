import { useState, useEffect } from "react"

export default function PokemonCard({ p }) {
    const [pokemonData, setPokemonData] = useState({})
    const [types, setTypes] = useState([])
    const [pokemonImg, setPokemonImg] = useState('')

    useEffect(() => {
        const abortController = new AbortController()
        const getData = async () => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p}`, {
                    signal: abortController.signal,
                })
                const data = await res.json()
                setPokemonData(data)
                setTypes(data.types)
                setPokemonImg(data.sprites.front_default)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
        return () => abortController.abort()
    }, [p])

    return (
        <div className="bg-teal-400 m-3 p-5 w-1/5 flex flex-col items-center rounded-3xl">
            <h1 className="text-3xl">{p}</h1>
            <img src={`${pokemonImg}`} alt="pokemon-sprites"/>
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            <div className="text-center">Types: {types.map(t => (
                <p key={t.type.name}>{t.type.name}</p>
            ))}</div>
            
        </div>
    )
}