import PropTypes from "prop-types";
import "../../assets/styles/toggleSwitch.css";

export function ToggleSwitch({ name, value, onChange }) {
	return (
		<label className="switch">
			<input type="checkbox" name={name} value={value} onChange={onChange} />
			<span className="slider round"></span>
		</label>
	);
}

ToggleSwitch.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};
