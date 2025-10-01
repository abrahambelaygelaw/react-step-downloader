// App.jsx
import React, { useState, useRef } from 'react';
import CycloidalDrive from './components/CycloidalDrive';
import ComparisonSection from './components/ComparisonSection';
import ChartsSection from './components/ChartsSection';
import OtherSettings from './components/OtherSettings';

function App() {
  const [driveParams, setDriveParams] = useState({
    inputSpeed: 10,
    fixedRingDiameter: 20,
    numberOfExternalPins: 10,
    externalPinDiameter: 3,
    numberOfOutputPins: 5,
    outputPinDiameter: 2,
    outputDiskDiameter: 10,
    numberOfLobes: 9,
    eccentricity: 0.75,
    camshaftHole: 4.0,
    thickness: 2.5,
    phase: 1,
    outerRingDiskClearance: 0
  });

  const [results, setResults] = useState({
    transmissionRatio: 9,
    outputSpeed: 0.3488,
    averagePressureAngle: 40,
    pressureAngleRange: 40
  });

  const driveRef = useRef();

  const handleParamChange = (param, value) => {
    console.log("changing inputs",{param} ,{value})
    console.log()
    setDriveParams((prev) => {
      console.log("previous", prev)
      return {
        ...prev,
        [param]: value

      }
    });
  };

  const updateResults = (newResults) => {
    setResults(newResults);
  };

  return (
    <div className="elementor-widget-container">
      <CycloidalDrive 
        ref={driveRef}
        params={driveParams}
        onParamChange={handleParamChange}
        onResultsUpdate={updateResults}
      />
      
      <ChartsSection driveRef={driveRef} />
      
      <OtherSettings 
        params={driveParams}
        onParamChange={handleParamChange}
      />
      
      <ComparisonSection />
    </div>
  );
}

export default App;