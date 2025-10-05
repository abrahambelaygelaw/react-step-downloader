// components/CycloidalDrive.jsx
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import InputPanel from './InputPanel';
import CanvasDisplay from './CanvasDisplay';
import OutputPanel from './OutputPanel';

const CycloidalDrive = forwardRef(({ params, onParamChange, onResultsUpdate }, ref) => {
  const canvasRef = useRef();
  const [results, setResults] = useState({
    transmissionRatio: 9,
    outputSpeed: 0.3488,
    averagePressureAngle: 40,
    pressureAngleRange: 40
  });

  useImperativeHandle(ref, () => ({
    getEngine: () => canvasRef.current?.getEngine?.(),
    updateParams: (newParams) => {
      canvasRef.current?.updateParams?.(newParams);
    }
  }));

  const handleResultsUpdate = (newResults) => {
    setResults(newResults);
    onResultsUpdate(newResults);
  };

  return (
    <section className="simulator-section">
      <div style={{ display: 'flex' }} className="canvas-dropdown-container">
        <CanvasDisplay 
          ref={canvasRef}
          params={params} 
          onResultsUpdate={handleResultsUpdate}
        />
        <OutputPanel results={results} params={params} />
      </div>
      
      <InputPanel params={params} onParamChange={onParamChange} />
    </section>
  );
});

export default CycloidalDrive;