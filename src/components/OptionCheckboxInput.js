import React from 'react';
import PropTypes from 'prop-types';

export default function OptionCheckboxInput({
  checked,
  onChange,
  labelKey,
  children,
}) {
  return (
    <label htmlFor={labelKey}>
      {children}
      <input
        type="checkbox"
        id={labelKey}
        className="options-input"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
    </label>
  );
}

OptionCheckboxInput.propTypes = {
  checked: PropTypes.bool.isRequired,
  labelKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
