import { useCallback, useMemo, useRef, useState } from "react";
import { getMovies } from "../services/getMovies";

export function useMovies({ search, sorted }) {
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Evitar llamar a la API para la misma búsqueda
	const previousSearch = useRef(search);

	// Usamos useCallback para evitar que se cree la función de nuevo en cada render,
	// y así funcione el debounce y solo haga una llamada a la API.
	const searchMovies = useCallback(async ({ search }) => {
		if (search === previousSearch.current) return;

		try {
			setLoading(true);
			setError(null);

			// Guardamos el estado anterior
			previousSearch.current = search;

			const movies = await getMovies({ search });
			setMovies(movies);
		} catch (error) {
			setMovies([]);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	// Usamos useMemo para evitar que ordene las películas cada vez que escribimos en el input
	// Solo las ordenará cuando cambie el valor del sorted o las movies
	const sortedMovies = useMemo(() => {
		return sorted ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
	}, [sorted, movies]);

	return { movies: sortedMovies, searchMovies, error, loading };
}
