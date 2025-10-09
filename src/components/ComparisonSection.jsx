// components/ComparisonSection.jsx
import React, { useEffect, useRef, useState } from "react";
import { generateChartData } from "../utils/chart-calculations";
import Chart from "chart.js/auto";
import { checkValueLimits } from "../utils/parameter-validation";

const ComparisonSection = () => {
  const singlePinChartRef = useRef(null);
  const averageChartRef = useRef(null);
  const singlePinChartInstance = useRef(null);
  const averageChartInstance = useRef(null);

  const [designA, setDesignA] = useState({
    fixedRingDiameter: 20,
    numberOfExternalPins: 10,
    externalPinDiameter: 3,
    numberOfOutputPins: 5,
    outputPinDiameter: 2,
    outputDiskDiameter: 10,
    eccentricity: 0.75,
    camshaftHole: 4.0,
    outerRingDiskClearance: 0,
  });

  const [designB, setDesignB] = useState({
    fixedRingDiameter: 20,
    numberOfExternalPins: 12,
    externalPinDiameter: 3,
    numberOfOutputPins: 5,
    outputPinDiameter: 2,
    outputDiskDiameter: 10,
    eccentricity: 0.75,
    camshaftHole: 4.0,
    outerRingDiskClearance: 0,
  });
  

  useEffect(() => {
    compareDesigns();
  }, []);
  const [comparisonResults, setComparisonResults] = useState(null);

  const handleDesignChange = (design, field, value) => {
    if (design === "A") {
      const updatedParams = { ...designA, [field]: value };
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
        outerRingDiskClearance: valueLimits.newDiOrC,
      };

      setDesignA(validatedParams);
    } else {
      const updatedParams = { ...designB, [field]: value };
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
        outerRingDiskClearance: valueLimits.newDiOrC,
      };
      setDesignB(validatedParams);
    }
  };

  const compareDesigns = () => {
      const {
        angles: anglesA,
        singlePinData: singlePinDataA,
        averageData: averageDataA,
        averagePressureAngle : averagePressureAngleA,
        averageRange : averagePressureRangeA
      } = generateChartData(designA);
      const {
        singlePinData: singlePinDataB,
        averageData: averageDataB,
        averagePressureAngle : averagePressureAngleB,
        averageRange : averagePressureRangeB
      } = generateChartData(designB);
  
      // Destroy existing charts
      if (singlePinChartInstance.current) {
        singlePinChartInstance.current.destroy();
      }
      if (averageChartInstance.current) {
        averageChartInstance.current.destroy();
      }
      const results = {
        designA: {
          transmissionRatio: (designA.numberOfExternalPins - 1).toFixed(2),
          averagePressureAngle: averagePressureAngleA,
          pressureAngleRange: averagePressureRangeA.toFixed(2),
        },
        designB: {
          transmissionRatio: (designB.numberOfExternalPins - 1).toFixed(2),
          averagePressureAngle:  averagePressureAngleB,
          pressureAngleRange: averagePressureRangeB.toFixed(2) ,
        },
      };
      setComparisonResults(results);
      // Create new charts
      singlePinChartInstance.current = new Chart(singlePinChartRef.current, {
        type: "line",
        data: {
          labels: anglesA,
          datasets: [
            {
              label: "Design A",
              data: singlePinDataA.map((d) => d.alpha_deg),
              borderColor: "#4CAF50",
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              tension: 0.1,
              pointRadius: 0,
            },
            {
              label: "Design B",
              data: singlePinDataB.map((d) => d.alpha_deg),
              borderColor: "#FF5722",
              backgroundColor: "rgba(33, 150, 243, 0.1)",
              tension: 0.1,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              suggestedMin: 0,
              suggestedMax: 360,
              afterBuildTicks: (chart) => {
                const desiredTicks = Array.from({ length: 19 }, (_, i) => i * 20);
                chart.ticks = desiredTicks.map((value) => ({ value }));
              },
              ticks: {
                callback: (value) => value,
              },
              title: { display: true, text: "Rotation Angle (degrees)" },
            },
            y: {
              title: { display: true, text: "Pressure Angle (degrees)" },
            },
          },
        },
      });
  
      averageChartInstance.current = new Chart(averageChartRef.current, {
        type: "line",
        data: {
          labels: anglesA,
          datasets: [
            {
              label: "Design A",
              data: averageDataA,
              borderColor: "#4CAF50",
              backgroundColor: "rgba(255, 87, 34, 0.1)",
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: "Design B",
              data: averageDataB,
              borderColor: "#FF5722",
              backgroundColor: "rgba(156, 39, 176, 0.1)",
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              suggestedMin: 0,
              suggestedMax: 360,
              afterBuildTicks: (chart) => {
                const desiredTicks = Array.from({ length: 19 }, (_, i) => i * 20);
                chart.ticks = desiredTicks.map((value) => ({ value }));
              },
              ticks: {
                callback: (value) => value,
              },
              title: { display: true, text: "Rotation Angle (degrees)" },
            },
            y: {
              title: { display: true, text: "Pressure Angle (degrees)" },
            },
          },
        },
      });
   
  };

 

  const DesignInputs = ({ design, values, onChange }) => (
    <div className="compared">
      <h3>Design {design}</h3>
      {[
        {
          id: "fixedRingDiameter",
          label: "Fixed Ring Diameter:",
          value: values.fixedRingDiameter,
          step: 0.5,
        },
        {
          id: "numberOfExternalPins",
          label: "Number of External Pins:",
          value: values.numberOfExternalPins,
          step: 1,
        },
        {
          id: "externalPinDiameter",
          label: "External Pin Diameter:",
          value: values.externalPinDiameter,
          step: 0.1,
        },
        {
          id: "numberOfOutputPins",
          label: "Number of Output Pins:",
          value: values.numberOfOutputPins,
          step: 1,
        },
        {
          id: "outputPinDiameter",
          label: "Output Pin Diameter:",
          value: values.outputPinDiameter,
          step: 0.1,
        },
        {
          id: "outputDiskDiameter",
          label: "Output Disk Diameter:",
          value: values.outputDiskDiameter,
          step: 0.1,
        },
        {
          id: "eccentricity",
          label: "Eccentricity:",
          value: values.eccentricity,
          step: 0.01,
        },
        {
          id: "camshaftHole",
          label: "Camshaft Hole:",
          value: values.camshaftHole,
          step: 0.1,
        },
      ].map((field) => (
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
          <p>
            Transmission Ratio:{" "}
            {comparisonResults[`design${design}`].transmissionRatio}
          </p>
          <p>
            Average Pressure Angle:{" "}
            {comparisonResults[`design${design}`].averagePressureAngle}°
          </p>
          <p>
            Pressure Angle Range:{" "}
            {comparisonResults[`design${design}`].pressureAngleRange}°
          </p>
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
            onChange={(field, value) => handleDesignChange("A", field, value)}
          />
          <DesignInputs
            design="B"
            values={designB}
            onChange={(field, value) => handleDesignChange("B", field, value)}
          />
        </div>
        <div className="compare_button_container">
          <button
            className="button"
            id="compare_button"
            onClick={compareDesigns}
          >
            Compare Designs
          </button>
        </div>
      </div>

      <div className="comparison-charts">
        <div className="chart-container">
          <div className="chart-header">
            <h4>Single Pin Pressure Angle Comparison</h4>
          </div>
          <canvas ref={singlePinChartRef} width="500" height="500"></canvas>
        </div>
        <div className="chart-container">
          <div className="chart-header">
            <h4>Average Pressure Angle Comparison</h4>
          </div>
          <canvas ref={averageChartRef} width="500" height="500"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;
