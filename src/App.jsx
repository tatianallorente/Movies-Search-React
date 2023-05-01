import { useCallback, useState } from "react";
import debounce from "just-debounce-it";
import MoviesList from "./components/MoviesList";
import ToggleSwitch from "./components/ui/ToggleSwitch";
import { useMovies } from "./components/hooks";
import "./App.css";

function App() {
	const [sorted, setSorted] = useState(false);
	const [search, setSearch] = useState("");
	const [invalidForm, setInvalidForm] = useState(null);

	const { movies, searchMovies, error, loading } = useMovies({ search, sorted });

	// Metemos la función debounce dentro de un useCallback porque sino no funcionaría como se espera,
	// ya que se crearía la función de nuevo en cada render.
	// Si no usáramos debounce, mostraría los resultados de la llamada que más haya tardado en responder.
	const debouncedSearchMovies = useCallback(
		debounce((search) => {
			searchMovies({ search });
		}, 300),
		[searchMovies]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		invalidForm === null && searchMovies({ search });
	};

	const handleChange = (e) => {
		const newSearch = e.target.value;
		setSearch(newSearch);

		// Validación
		if (newSearch === "") {
			setInvalidForm("No se puede buscar una película vacía");
			return;
		}

		if (newSearch.length < 3) {
			setInvalidForm("La búsqueda debe tener al menos 3 caracteres");
			return;
		}

		setInvalidForm(null);
		debouncedSearchMovies(newSearch);
	};

	const handleSorted = () => {
		setSorted(!sorted);
	};

	return (
		<>
			<header className="header">
				<h2>Buscador de películas</h2>
				<form className="form" onSubmit={handleSubmit}>
					<div className="searchBox">
						<input
							type="text"
							name="searchForm"
							placeholder="Avengers, Matrix..."
							value={search}
							onChange={handleChange}
							autoComplete="off"
						/>
						<button type="submit">Buscar</button>
					</div>
					<div className="toggleSort">
						<ToggleSwitch name="sorted" value={sorted} onChange={handleSorted} />
						<label htmlFor="sorted">Ordenar por título</label>
					</div>
				</form>
				{invalidForm !== null && <p className="error">{invalidForm}</p>}
			</header>
			<main>
				{loading ? (
					<div className="spinner">
						<span>Cargando...</span>
					</div>
				) : (
					<MoviesList movies={movies} error={error} />
				)}
			</main>
		</>
	);
}

export default App;
