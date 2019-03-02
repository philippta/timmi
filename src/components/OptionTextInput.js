import React from 'react';
import PropTypes from 'prop-types';

export default function OptionTextInput({
  value,
  onChange,
  labelKey,
  children,
}) {
  return (
    <label htmlFor={labelKey}>
      {children}
      <input
        type="text"
        id={labelKey}
        className="options-input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </label>
  );
}

OptionTextInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  labelKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
