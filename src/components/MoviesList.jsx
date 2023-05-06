import PropTypes from "prop-types";

import noImg from "../assets/img/no_img.png";

function MoviesList({ movies, totalMovies, search }) {
	return (
		<>
			<p className="searchResults">
				<span>{totalMovies}</span> resultados para <span>{search}</span>
			</p>
			<ul className="moviesList">
				{movies?.map((movie) => (
					<li className="moviesList-item" key={movie.id}>
						<img
							src={movie.poster !== "N/A" ? movie.poster : noImg}
							alt={`poster-${movie.title}`}
						/>
						<div className="moviesList-item--title">
							<h3>{movie.title}</h3>
							<p>{movie.year}</p>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default MoviesList;

MoviesList.propTypes = {
	movies: PropTypes.array.isRequired,
	totalMovies: PropTypes.number.isRequired,
	search: PropTypes.string.isRequired,
};
