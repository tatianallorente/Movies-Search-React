import PropTypes from "prop-types";

export function ErrorMsg({ error }) {
	return (
		<div className="errorMsg">
			<span>{error}</span>
		</div>
	);
}

ErrorMsg.propTypes = {
	error: PropTypes.string.isRequired,
};
