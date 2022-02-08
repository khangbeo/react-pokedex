import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CardDetail = () => {
    let { id } = useParams()

    const [fetchedData, updateFetchedData] = useState({})
    const [pokemonImg, setPokemonImg] = useState({})
    const [types, setTypes] = useState([])
    const [abilities, setAbilities] = useState([])
    const [moves, setMoves] = useState([])
    let { height, name, weight } = fetchedData
    console.log(moves)
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`

    useEffect(() => {
        (async function () {
            let data = await fetch(url).then(res => res.json())
            updateFetchedData(data)
            setPokemonImg(data.sprites)
            setTypes(data.types.map(t => t.type.name))
            setAbilities(data.abilities.map(a => a.ability.name))
            setMoves(data.moves)
        })()
    }, [url])


    return (
        <div className='container mx-auto'>
            <div className="m-5 p-5 bg-red-400">
                <h1 className='text-3xl font-bold' style={{ textTransform: 'capitalize' }}>{name}</h1>
                <img src={`${pokemonImg.front_default}`} alt="front" />
                <img src={`${pokemonImg.back_default}`} alt="back" />
                <div><span className="font-bold">Type(s):</span> {`${types[0]}, ${types[1]}`}</div>
                <div><span className="font-bold">Abilities:</span> {`${abilities[0]}, ${abilities[1]}`}</div>
                <div><span className="font-bold">Weight:</span> {weight}</div>
                <div><span className="font-bold">Height:</span> {height}</div>
            </div>
            
            <div className="flex justify-center">
            <div className="columns-4 w-5/6 p-5">
            <span className="text-2xl font-bold">Moves:</span>
                {moves.map(({ move: { name }, version_group_details: [{ level_learned_at }] }) => (
                    <div key={name}><span className="font-bold">Level {level_learned_at}</span> - {name}</div>
                ))}
            </div>
            </div>
            
        </div>
    )
}

export default CardDetail