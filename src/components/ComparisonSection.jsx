// components/ComparisonSection.jsx
import React, { useState } from 'react';

const ComparisonSection = () => {
  const [designA, setDesignA] = useState({
    fixedRingDiameter: 20,
    numberOfExternalPins: 10,
    externalPinDiameter: 3,
    numberOfOutputPins: 5,
    outputPinDiameter: 2,
    outputDiskDiameter: 10,
    eccentricity: 0.75,
    camshaftHole: 4.0
  });

  const [designB, setDesignB] = useState({
    fixedRingDiameter: 20,
    numberOfExternalPins: 12,
    externalPinDiameter: 3,
    numberOfOutputPins: 5,
    outputPinDiameter: 2,
    outputDiskDiameter: 10,
    eccentricity: 0.75,
    camshaftHole: 4.0
  });

  const [comparisonResults, setComparisonResults] = useState(null);

  const handleDesignChange = (design, field, value) => {
    if (design === 'A') {
      setDesignA(prev => ({ ...prev, [field]: value }));
    } else {
      setDesignB(prev => ({ ...prev, [field]: value }));
    }
  };

  const compareDesigns = () => {
    // Mock comparison logic - replace with actual calculations
    const results = {
      designA: {
        transmissionRatio: (designA.numberOfExternalPins - 1).toFixed(2),
        averagePressureAngle: "40.00",
        pressureAngleRange: "5.00"
      },
      designB: {
        transmissionRatio: (designB.numberOfExternalPins - 1).toFixed(2),
        averagePressureAngle: "38.50",
        pressureAngleRange: "4.50"
      }
    };
    setComparisonResults(results);
  };

  const DesignInputs = ({ design, values, onChange }) => (
    <div className="compared">
      <h3>Design {design}</h3>
      {[
        { id: 'diameter', label: 'Fixed Ring Diameter:', value: values.fixedRingDiameter, step: 0.5 },
        { id: 'externalPins', label: 'Number of External Pins:', value: values.numberOfExternalPins, step: 1 },
        { id: 'externalPinDiameter', label: 'External Pin Diameter:', value: values.externalPinDiameter, step: 0.1 },
        { id: 'outputPins', label: 'Number of Output Pins:', value: values.numberOfOutputPins, step: 1 },
        { id: 'outputPinDiameter', label: 'Output Pin Diameter:', value: values.outputPinDiameter, step: 0.1 },
        { id: 'outputDiskDiameter', label: 'Output Disk Diameter:', value: values.outputDiskDiameter, step: 0.1 },
        { id: 'eccentricity', label: 'Eccentricity:', value: values.eccentricity, step: 0.01 },
        { id: 'camshaftHole', label: 'Camshaft Hole:', value: values.camshaftHole, step: 0.1 }
      ].map(field => (
        <div key={field.id} className="input-group">
          <div className="label">
            <label className="color-white">{field.label}</label>
          </div>
          <input
            type="number"
            value={field.value}
            step={field.step}
            className="input-box"
            onChange={(e) => onChange(field.id, parseFloat(e.target.value))}
          />
        </div>
      ))}
      
      {comparisonResults && (
        <div className="comparison-output">
          <h4>Results:</h4>
          Transmission Ratio: {comparisonResults[`design${design}`].transmissionRatio} <br />
          Average Pressure Angle: {comparisonResults[`design${design}`].averagePressureAngle}° <br />
          Pressure Angle Range: {comparisonResults[`design${design}`].pressureAngleRange}° <br />
        </div>
      )}
    </div>
  );

  return (
    <div className="full-comparison-container">
      <div className="comparison-parameters">
        <div className="comparison-section">
          <DesignInputs 
            design="A" 
            values={designA} 
            onChange={(field, value) => handleDesignChange('A', field, value)} 
          />
          <DesignInputs 
            design="B" 
            values={designB} 
            onChange={(field, value) => handleDesignChange('B', field, value)} 
          />
        </div>
        <div className="compare_button_container">
          <button className="button" id="compare_button" onClick={compareDesigns}>
            Compare designs
          </button>
        </div>
      </div>

      <div className="comparison-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h4>Compared Single Pin Pressure Angle</h4>
          </div>
          <canvas id="comparedaSinglePinChart" width="500" height="500"></canvas>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h4>Compared Average Pressure Angle</h4>
          </div>
          <canvas id="comparedaAveragePressureAngleChart" width="500" height="500"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;