# React Pokédex

A modern, responsive Pokédex application built with React and the PokeAPI. This application allows users to browse, search, and compare Pokémon from all generations.

## Features

-   **Browse Pokémon**: View all Pokémon with pagination support
-   **Search Functionality**: Search for Pokémon by name
-   **Region Filtering**: Filter Pokémon by region (Kanto, Johto, Hoenn, etc.)
-   **Detailed View**: Comprehensive information for each Pokémon including:
    -   Base stats
    -   Characteristics (species, color, egg groups, gender rate)
    -   Evolution chain
    -   Moves list
    -   Type information
    -   Physical attributes
-   **Compare Feature**: Select two Pokémon to compare their stats side by side
-   **Responsive Design**: Works seamlessly on both desktop and mobile devices
-   **URL-based Navigation**: Shareable links with pagination support
-   **Scroll to Top**: Quick navigation back to the top of the page

## Technologies Used

-   React.js
-   React Router for navigation
-   TailwindCSS for styling
-   PokeAPI for data
-   Create React App for project setup

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/react-pokedex.git
```

2. Navigate to the project directory:

```bash
cd react-pokedex
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Usage

1. **Browse Pokémon**:

    - Use the pagination controls to navigate through all Pokémon
    - Click on any Pokémon card to view detailed information

2. **Search Pokémon**:

    - Use the search bar in the navigation to find specific Pokémon
    - Results update in real-time as you type

3. **Filter by Region**:

    - Use the region filter to view Pokémon from specific generations
    - Select "All" to return to the complete list

4. **Compare Pokémon**:
    - Click the compare button on any Pokémon card
    - Select a second Pokémon to view the comparison
    - Close the comparison modal to start over

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

-   [PokeAPI](https://pokeapi.co/) for providing the Pokémon data
-   [Pokémon](https://www.pokemon.com/) for the original content
