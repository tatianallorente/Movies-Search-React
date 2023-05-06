import { useCallback, useState, useEffect, useRef } from "react";
import debounce from "just-debounce-it";

import MoviesList from "./components/MoviesList";
import Search from "./components/Search";
import { Footer } from "./components/ui";
import { useMovies, useNearScreen } from "./components/hooks";
import "./App.css";

function App() {
	const [sorted, setSorted] = useState(false);
	const [search, setSearch] = useState("");

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
					<Search
						search={search}
						setSearch={setSearch}
						searchMovies={searchMovies}
						sorted={sorted}
						handleSorted={handleSorted}
					/>
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
			<Footer />
		</>
	);
}

export default App;
