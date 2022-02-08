import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <div className='text-center font-bold'>
            <Link to='/' style={{fontSize: '3rem'}}>Pokedex</Link>
        </div>
    )
}