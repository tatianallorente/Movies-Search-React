import { useCallback, useState, useEffect, useRef } from "react";
import debounce from "just-debounce-it";
import MoviesList from "./components/MoviesList";
import ToggleSwitch from "./components/ui/ToggleSwitch";
import { useMovies, useNearScreen } from "./components/hooks";
import "./App.css";

function App() {
	const [sorted, setSorted] = useState(false);
	const [search, setSearch] = useState("");
	const [invalidForm, setInvalidForm] = useState(null);

	const { movies, searchMovies, error, loading, setPage, loadingNextPage, totalMovies } = useMovies(
		{
			search,
			sorted,
		}
	);

	// Usamos el custom hook useNearScreen para saber cuando se va acercando al final de la página
	const externalRef = useRef();
	const { isNearScreen } = useNearScreen({
		externalRef: loading ? null : externalRef,
		once: false,
	});

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

	const debounceHandleNextPage = useCallback(
		debounce(() => setPage((prevPage) => prevPage + 1), 200),
		[setPage]
	);

	useEffect(() => {
		if (isNearScreen) {
			debounceHandleNextPage();
		}
	}, [debounceHandleNextPage, isNearScreen]);

	return (
		<>
			<div className="app">
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
						<p className="loader"></p>
					) : (
						<>
							{movies?.length > 0 && (
								<p className="searchResults">
									<span>{totalMovies}</span> resultados para <span>{search}</span>
								</p>
							)}
							<MoviesList movies={movies} error={error} />
							{movies?.length > 0 && <div id="visor" ref={externalRef}></div>}
							{loadingNextPage && <p className="loader"></p>}
						</>
					)}
				</main>
			</div>
			<footer className="footer">
				&copy; Designed and developed by&nbsp;
				<a
					href="https://github.com/tatianallorente/Movies-Search-React"
					target="_blank"
					rel="noreferrer"
				>
					Tatiana Llorente
				</a>
			</footer>
		</>
	);
}

export default App;
