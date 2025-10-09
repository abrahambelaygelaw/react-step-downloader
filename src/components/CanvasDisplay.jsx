// components/CanvasDisplay.jsx
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { CycloidalDriveEngine } from '../utils/cycloidal-drive-engine';

const CanvasDisplay = forwardRef(({ params, onResultsUpdate }, ref) => {
  const canvasRef = useRef();
  const engineRef = useRef();

  useImperativeHandle(ref, () => ({
    getEngine: () => engineRef.current,
    updateParams: (newParams) => {
      if (engineRef.current) {
        engineRef.current.updateParams(newParams);
      }
    }
  }));

  useEffect(() => {
    if (canvasRef.current) {
      engineRef.current = new CycloidalDriveEngine(canvasRef.current, params);
      engineRef.current.init();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateParams(params);
    }
  }, [params]);

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <canvas 
        ref={canvasRef}
        width="500" 
        height="500"
        id='main_canvas'
      >
        Your browser does not support the HTML5 canvas tag.
      </canvas>
    </div>
  );
});

export default CanvasDisplay;