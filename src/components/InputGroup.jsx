// components/InputGroup.jsx
import React from 'react';

const InputGroup = ({ id, label, value, min, max, step, tooltip, onChange, disabled = false }) => {
  return (
    <div className="input-group">
      <div className="label">
        <label htmlFor={id} className="color-white">{label}</label>
        <span className="info-icon tooltip" data-tooltip={tooltip}>?</span>
      </div>
      <input
        type="number"
        id={id}
        value={value}
        min={min}
        max={max}
        step={step}
        className={disabled ? "input-box-grey" : "input-box"}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default InputGroup;