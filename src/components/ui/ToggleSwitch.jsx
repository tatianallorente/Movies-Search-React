import PropTypes from "prop-types";
import "../../assets/styles/toggleSwitch.css";

function ToggleSwitch({ name, value, onChange }) {
	return (
		<label className="switch">
			<input type="checkbox" name={name} value={value} onChange={onChange} />
			<span className="slider round"></span>
		</label>
	);
}

export default ToggleSwitch;

ToggleSwitch.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};
