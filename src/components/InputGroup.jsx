import React, { useState } from 'react';

const InputGroup = ({ id, label, value, min, max, step, tooltip, onChange, img, disabled = false }) => {
  const [localValue, setLocalValue] = useState(value);
  // Keep local input synced if parent updates it (e.g., after value limits)
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    const parsedValue = parseFloat(localValue);
    if (!isNaN(parsedValue)) onChange(parsedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // triggers handleBlur automatically
    }
  };

  return (
    <div className="input-group">
      <div className="label">
        <label htmlFor={id} className="color-white">{label}</label>
       { img ? <span class="info-icon-image tooltip" title="Outer diameter of drive."
        >?<span class="tooltiptext"
          ><img src={`../../assets/${img}`} /></span
      ></span> : <span className="info-icon tooltip" data-tooltip={tooltip}>?</span>}
      </div>
      <input
        type="number"
        id={id}
        value={localValue}
        min={min}
        max={max}
        step={step}
        className={disabled ? "input-box-grey" : "input-box"}
        disabled={disabled}
        onChange={(e) => setLocalValue(e.target.value)} // only update local
        onBlur={handleBlur} // trigger callback when focus leaves
        onKeyDown={handleKeyDown} // handle Enter key
      />
      
    </div>
  );
};

export default InputGroup;
