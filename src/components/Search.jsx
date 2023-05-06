import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import debounce from "just-debounce-it";

import { ToggleSwitch } from "./ui";

function Search({ search, setSearch, searchMovies, sorted, handleSorted }) {
	const [invalidForm, setInvalidForm] = useState(null);

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

	return (
		<>
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
		</>
	);
}

export default Search;

Search.propTypes = {
	search: PropTypes.string.isRequired,
	setSearch: PropTypes.func.isRequired,
	searchMovies: PropTypes.func.isRequired,
	sorted: PropTypes.bool.isRequired,
	handleSorted: PropTypes.func.isRequired,
};
