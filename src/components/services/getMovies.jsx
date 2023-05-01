const API_KEY = "95e68c78";

export const getMovies = async ({ search }) => {
	const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`;

	try {
		const response = await fetch(url);

		if (response.ok) {
			const movies = await response.json();

			if (movies?.Search) {
				const mappedMovies = movies?.Search?.map((movie) => ({
					id: movie.imdbID,
					title: movie.Title,
					year: movie.Year,
					poster: movie.Poster,
				}));

				return mappedMovies;
			} else {
				throw new Error(movies?.Error);
			}
		} else {
			throw new Error("Error with the API call");
		}
	} catch (error) {
		throw new Error(error?.message || "Error searching movies");
	}
};
