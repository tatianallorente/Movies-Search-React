import PropTypes from "prop-types";

function MoviesList({ movies, error }) {
	return (
		<>
			{error !== null ? (
				<div className="errorMsg">
					<span>{error}</span>
				</div>
			) : (
				<ul className="moviesList">
					{movies?.map((movie) => (
						<li key={movie.id}>
							<h3>{movie.title}</h3>
							<p>{movie.year}</p>
							<img src={movie.poster} alt={`poster-${movie.title}`} />
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export default MoviesList;

MoviesList.propTypes = {
	movies: PropTypes.array.isRequired,
	error: PropTypes.string,
};
