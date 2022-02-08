import { useState, useEffect } from 'react';
import PokemonList from './components/PokemonList';
import Pagination from './components/Pagination';

function App() {

  const [pokemon, setPokemon] = useState([])
  const [currentPageUrl, setCurrentPageUrl] = useState('https://pokeapi.co/api/v2/pokemon/')
  const [nextPageUrl, setNextPageUrl] = useState('')
  const [prevPageUrl, setPrevPageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    const getData = async () => {
      try {
        const res = await fetch(currentPageUrl)
        const data = await res.json()
        setLoading(false)
        setPokemon(data.results.map(p => p.name))
        setNextPageUrl(data.next)
        setPrevPageUrl(data.previous)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
    return () => abortController.abort()
  }, [currentPageUrl])

  if (loading) return 'Loading...'
  
  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl)
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl)
  }

  return (
    <div className='bg-red-100'>
      <div className='container mx-auto py-5'>
        <h1 className='text-center font-bold' style={{fontSize: '3rem'}}>Pokedex</h1>
        <Pagination 
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
        <PokemonList pokemon={pokemon} />
        <Pagination 
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      </div>
    </div>
    
  );
}

export default App;
