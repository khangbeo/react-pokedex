import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function PokemonCard({ p }) {
    const [id, setId] = useState(null)
    const [pokemonImg, setPokemonImg] = useState('')

    useEffect(() => {
        const abortController = new AbortController()
        const getData = async () => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p}`, {
                    signal: abortController.signal,
                })
                const data = await res.json()
                setId(data.id)
                setPokemonImg(data.sprites.front_default)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
        return () => abortController.abort()
    }, [p])

    return (
        
        <Link to={`/${id}`} className="bg-teal-400 m-6 p-5 w-1/5 flex flex-col items-center rounded-3xl hover:shadow-2xl">
            <h1 className="text-3xl" style={{textTransform: 'capitalize'}}>{p}</h1>
            <img src={`${pokemonImg}`} alt="pokemon-sprites"/>
        </Link>
        
        
    )
}