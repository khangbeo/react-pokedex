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
import FilterSidebar from "./components/FilterSidebar";

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
    const [filters, setFilters] = useState({
        types: [],
        generation: null,
        sortBy: "id",
    });

    useEffect(() => {
        const page = parseInt(searchParams.get("page") || "1");
        setCurrentPage(page);
        const offset = (page - 1) * 20;
        setCurrentPageUrl(
            `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`
        );
    }, [searchParams]);

    useEffect(() => {
        setLoading(true);
        fetch(currentPageUrl)
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                setPokemon(data.results);
                setNextPageUrl(data.next);
                setPrevPageUrl(data.previous);
                setTotalPages(Math.ceil(data.count / 20));
            })
            .catch((error) => {
                console.error("Error fetching Pokemon:", error);
                setLoading(false);
            });
    }, [currentPageUrl]);

    const nextPage = () => {
        const newPage = currentPage + 1;
        setSearchParams({ page: newPage.toString() });
        navigate(`/?page=${newPage}`);
    };

    const prevPage = () => {
        const newPage = currentPage - 1;
        setSearchParams({ page: newPage.toString() });
        navigate(`/?page=${newPage}`);
    };

    const gotoPage = (pageNumber) => {
        setSearchParams({ page: pageNumber.toString() });
        navigate(`/?page=${pageNumber}`);
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

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setSearchParams({ page: "1" }); // Reset to first page when filters change
    };

    const filteredPokemons = pokemon
        .filter((pokemon) => {
            // Type filter
            if (filters.types.length > 0) {
                // We'll need to fetch the pokemon's types to filter by type
                // This is a simplified version - you might want to cache the type data
                return true; // Placeholder
            }

            // Generation filter
            if (filters.generation) {
                const pokemonId = parseInt(
                    pokemon.url.split("/").slice(-2, -1)[0]
                );
                return (
                    pokemonId >= filters.generation.start &&
                    pokemonId <= filters.generation.end
                );
            }

            return true;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "id":
                    return (
                        parseInt(a.url.split("/").slice(-2, -1)[0]) -
                        parseInt(b.url.split("/").slice(-2, -1)[0])
                    );
                default:
                    return 0;
            }
        });

    const totalPagesFiltered = Math.ceil(filteredPokemons.length / 20);
    const paginatedPokemons = filteredPokemons.slice(
        (currentPage - 1) * 20,
        (currentPage - 1) * 20 + 20
    );

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage.toString() });
        window.scrollTo(0, 0);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                <FilterSidebar onFilterChange={handleFilterChange} />
                <div className="flex-1">
                    <RegionFilter
                        selectedRegion={selectedRegion}
                        onRegionChange={handleRegionChange}
                    />
                    <div className="mb-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPagesFiltered}
                            gotoNextPage={nextPage}
                            gotoPrevPage={prevPage}
                            gotoPage={gotoPage}
                        />
                    </div>
                    <PokemonList
                        pokemon={paginatedPokemons}
                        onCompare={handleCompare}
                        selectedPokemon={selectedPokemon}
                        loading={loading}
                        onPageChange={handlePageChange}
                    />
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPagesFiltered}
                            gotoNextPage={nextPage}
                            gotoPrevPage={prevPage}
                            gotoPage={gotoPage}
                        />
                    </div>
                </div>
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
