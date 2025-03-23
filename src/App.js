import {
    BrowserRouter as Router,
    Routes,
    Route,
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PokemonList from "./components/PokemonList";
import CardDetail from "./components/CardDetail";
import Pagination from "./components/Pagination";
import RegionFilter from "./components/RegionFilter";
import Footer from "./components/Footer";
import CompareModal from "./components/CompareModal";

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPageUrl, setCurrentPageUrl] = useState(
        "https://pokeapi.co/api/v2/pokemon/"
    );
    const [nextPageUrl, setNextPageUrl] = useState("");
    const [prevPageUrl, setPrevPageUrl] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedPokemon, setSelectedPokemon] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const page = parseInt(searchParams.get("page") || "1");
        setCurrentPage(page);
        const offset = (page - 1) * 20;
        setCurrentPageUrl(
            `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
        );
    }, [searchParams]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                setLoading(true);
                const response = await fetch(currentPageUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch Pokemon");
                }
                const data = await response.json();
                setPokemon(data.results);
                setNextPageUrl(data.next || "");
                setPrevPageUrl(data.previous || "");
                setTotalPages(Math.ceil(data.count / 20));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [currentPageUrl]);

    const handleNextPage = () => {
        if (nextPageUrl) {
            setCurrentPageUrl(nextPageUrl);
            setCurrentPage((prev) => prev + 1);
            setSearchParams({ page: currentPage + 1 });
        }
    };

    const handlePrevPage = () => {
        if (prevPageUrl) {
            setCurrentPageUrl(prevPageUrl);
            setCurrentPage((prev) => prev - 1);
            setSearchParams({ page: currentPage - 1 });
        }
    };

    const handlePageChange = (page) => {
        const offset = (page - 1) * 20;
        setCurrentPageUrl(
            `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
        );
        setCurrentPage(page);
        setSearchParams({ page });
    };

    const handleRegionChange = async (region) => {
        setSelectedRegion(region);
        setLoading(true);

        if (region === "all") {
            setCurrentPageUrl("https://pokeapi.co/api/v2/pokemon/");
            setCurrentPage(1);
            setTotalPages(1);
            setSearchParams({ page: "1" });
            navigate("/?page=1");
        } else {
            const ranges = {
                kanto: { start: 1, end: 151 },
                johto: { start: 152, end: 251 },
                hoenn: { start: 252, end: 386 },
                sinnoh: { start: 387, end: 493 },
                unova: { start: 494, end: 649 },
                kalos: { start: 650, end: 721 },
                alola: { start: 722, end: 809 },
                galar: { start: 810, end: 905 },
            };

            const range = ranges[region];
            const allPokemon = [];
            for (let i = range.start; i <= range.end; i++) {
                const res = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${i}`
                );
                const data = await res.json();
                allPokemon.push(data);
            }
            setPokemon(allPokemon);
            setNextPageUrl("");
            setPrevPageUrl("");
            setCurrentPage(1);
            setTotalPages(1);
            setSearchParams({ page: "1" });
            navigate("/?page=1");
        }
        setLoading(false);
    };

    const handleCompare = (pokemon) => {
        if (selectedPokemon.length === 0) {
            setSelectedPokemon([pokemon]);
        } else if (selectedPokemon.length === 1) {
            if (selectedPokemon[0].name === pokemon.name) {
                console.log(selectedPokemon[0].name, pokemon.name);
                alert("Please select a different Pokémon to compare");
                return;
            }
            setSelectedPokemon([...selectedPokemon, pokemon]);
            setShowCompareModal(true);
        } else {
            setSelectedPokemon([pokemon]);
        }
    };

    const closeCompareModal = () => {
        setShowCompareModal(false);
        setSelectedPokemon([]);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <RegionFilter
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
            />
            <div className="mb-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    gotoNextPage={handleNextPage}
                    gotoPrevPage={handlePrevPage}
                    gotoPage={handlePageChange}
                />
            </div>
            <PokemonList
                pokemon={pokemon}
                onCompare={handleCompare}
                selectedPokemon={selectedPokemon}
            />
            <div className="mt-8">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    gotoNextPage={handleNextPage}
                    gotoPrevPage={handlePrevPage}
                    gotoPage={handlePageChange}
                />
            </div>
            {showCompareModal && selectedPokemon.length === 2 && (
                <CompareModal
                    pokemon1={selectedPokemon[0]}
                    pokemon2={selectedPokemon[1]}
                    onClose={closeCompareModal}
                />
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/pokemon/:id" element={<CardDetail />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
