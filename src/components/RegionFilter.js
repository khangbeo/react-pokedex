export default function RegionFilter({ selectedRegion, onRegionChange }) {
    const regions = [
        { id: "all", name: "All Regions" },
        { id: "kanto", name: "Kanto (1-151)" },
        { id: "johto", name: "Johto (152-251)" },
        { id: "hoenn", name: "Hoenn (252-386)" },
        { id: "sinnoh", name: "Sinnoh (387-493)" },
        { id: "unova", name: "Unova (494-649)" },
        { id: "kalos", name: "Kalos (650-721)" },
        { id: "alola", name: "Alola (722-809)" },
        { id: "galar", name: "Galar (810-898)" },
    ];

    return (
        <div className="flex justify-center mb-6">
            <select
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
            >
                {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                        {region.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
