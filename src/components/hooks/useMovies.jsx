import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { getMovies } from "../services/getMovies";

const INITIAL_PAGE = 1;

export function useMovies({ search, sorted }) {
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(INITIAL_PAGE);
	const [loadingNextPage, setLoadingNextPage] = useState(false);

	// Evitar llamar a la API para la misma búsqueda
	const previousSearch = useRef(search);

	const totalPages = useRef(null);
	const totalMovies = useRef(null);

	useEffect(() => {
		if (page === INITIAL_PAGE || page > totalPages.current) return;
		searchMoviesNextPage({ search });
	}, [page]);

	// Usamos useCallback para evitar que se cree la función de nuevo en cada render,
	// y así funcione el debounce y solo haga una llamada a la API.
	const searchMovies = useCallback(async ({ search }) => {
		if (search === previousSearch.current) return;

		try {
			setLoading(true);
			setError(null);
			setPage(INITIAL_PAGE);

			// Guardamos el estado anterior
			previousSearch.current = search;

			const { movies, totalResults } = await getMovies({ search });
			setMovies(movies);

			const maxPage = Math.round(totalResults / 10);
			totalPages.current = maxPage;
			totalMovies.current = totalResults;
		} catch (error) {
			setMovies([]);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const searchMoviesNextPage = async ({ search }) => {
		try {
			setLoadingNextPage(true);
			const { movies } = await getMovies({ search, page });
			setMovies((prevMovies) => prevMovies.concat(movies));
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingNextPage(false);
		}
	};

	// Usamos useMemo para evitar que ordene las películas cada vez que escribimos en el input
	// Solo las ordenará cuando cambie el valor del sorted o las movies
	const sortedMovies = useMemo(() => {
		return sorted ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
	}, [sorted, movies]);

	return {
		movies: sortedMovies,
		searchMovies,
		error,
		loading,
		setPage,
		loadingNextPage,
		totalMovies: totalMovies.current,
	};
}
