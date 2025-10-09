// App.jsx
import React, { useState, useRef, use, useEffect } from 'react';
import CycloidalDrive from './components/CycloidalDrive';
import ComparisonSection from './components/ComparisonSection';
import ChartsSection from './components/ChartsSection';
import OtherSettings from './components/OtherSettings';
import { checkValueLimits } from './utils/parameter-validation';
import { generateChartData } from './utils/chart-calculations';
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
    outputSpeed: 1.1111,
    averagePressureAngle: 29.40,
    pressureAngleRange: 1.99
  });


  const driveRef = useRef();
  useEffect(() => {
    // Initial calculation of results based on default parameters
    handleParamChange(null, null);
  }, []);

  const handleParamChange = (param, value) => {
    // 1️⃣ Create the updated params first
    const updatedParams = {
      ...driveParams,
      [param]: value
    };
  
    // Apply the limit checks using the *updated* values
    const valueLimits = checkValueLimits(
      updatedParams.fixedRingDiameter / 2,
      updatedParams.eccentricity,
      updatedParams.externalPinDiameter / 2,
      updatedParams.numberOfExternalPins,
      updatedParams.outputDiskDiameter / 2,
      updatedParams.outputPinDiameter / 2,
      updatedParams.numberOfOutputPins,
      updatedParams.camshaftHole / 2,
      updatedParams.outerRingDiskClearance
    );
  
    // Merge limited values back into the object
    const validatedParams = {
      ...updatedParams,
      fixedRingDiameter: valueLimits.newR * 2,
      eccentricity: valueLimits.newE,
      numberOfExternalPins: valueLimits.newN,
      externalPinDiameter: valueLimits.newRr * 2,
      outputDiskDiameter: valueLimits.newRo * 2,
      outputPinDiameter: valueLimits.newRi * 2,
      numberOfOutputPins: valueLimits.newNi,
      camshaftHole: valueLimits.newCH * 2,
      outerRingDiskClearance: valueLimits.newDiOrC
    };
  
    // Finally update state once
    if(validatedParams.phase===2 && validatedParams.numberOfExternalPins % 2 !== 0){
      validatedParams.phase=1;
    }
    if(validatedParams.phase===3 && validatedParams.numberOfExternalPins % 3 !== 0){
      validatedParams.phase=1;
    }
    setDriveParams(validatedParams);
    const reductionRatio = validatedParams.numberOfExternalPins - 1
    const outputSpeed = validatedParams.inputSpeed / reductionRatio
    const transmissionRatio = reductionRatio / (validatedParams.numberOfExternalPins - reductionRatio)
    
    const {averagePressureAngle, averageRange} = generateChartData(validatedParams)

    setResults({
      transmissionRatio: transmissionRatio.toFixed(2),
      outputSpeed: outputSpeed.toFixed(4),
      averagePressureAngle: averagePressureAngle,
      pressureAngleRange: averageRange.toFixed(2)
    });
  console.log("results from cycloid after change", results);

  }
  const updateResults = (newResults) => {
    setResults(newResults);
  };

  return (
    <div className="elementor-widget-container">
      <div style={{display :"flex", gap: "20px"}}>

      <CycloidalDrive 
        ref={driveRef}
        params={driveParams}
        onParamChange={handleParamChange}
        onResultsUpdate={updateResults}
        results={results}
        />
      
      <ChartsSection driveRef={driveRef} params={driveParams} />
        </div>
      <OtherSettings 
        params={driveParams}
        onParamChange={handleParamChange}
      />
      
      
      <ComparisonSection />
    </div>
  );
}

export default App;