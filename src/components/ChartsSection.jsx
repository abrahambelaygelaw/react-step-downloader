// components/ChartsSection.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {generateChartData} from '../utils/chart-calculations';
const ChartsSection = ({ driveRef, params }) => {
  const singlePinChartRef = useRef(null);
  const averageChartRef = useRef(null);
  const singlePinChartInstance = useRef(null);
  const averageChartInstance = useRef(null);
  useEffect(() => {
    if (!driveRef.current) return;

    // Generate sample chart data (replace with actual calculations from engine)
    

      const { angles, singlePinData, averageData } = generateChartData(params);
    // Destroy existing charts
      if (singlePinChartInstance.current) {
      singlePinChartInstance.current.destroy();
      }
      if (averageChartInstance.current) {
      averageChartInstance.current.destroy();
      }

    // Create new charts
      singlePinChartInstance.current = new Chart(singlePinChartRef.current, {
      type: 'line',
      data: {
        labels: angles,
        datasets: [{
          label: 'Pressure Angle',
          data: singlePinData.map((d)=>d.alpha_deg),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 360,
            afterBuildTicks: (chart) => {
              const desiredTicks = Array.from(
                { length: 19 },
                (_, i) => i * 20
              );
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
      }
    });

    averageChartInstance.current = new Chart(averageChartRef.current, {
      type: 'line',
      data: {
        labels: angles,
        datasets: [{
          label: 'Average Pressure Angle',
          data: averageData,
          borderColor: '#FF5722',
          backgroundColor: 'rgba(255, 87, 34, 0.1)',
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 360,
            afterBuildTicks: (chart) => {
              const desiredTicks = Array.from(
                { length: 19 },
                (_, i) => i * 20
              );
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
      }
    });

    return () => {
      if (singlePinChartInstance.current) {
        singlePinChartInstance.current.destroy();
      }
      if (averageChartInstance.current) {
        averageChartInstance.current.destroy();
      }
    };
  }, [driveRef.current]);

  return (
    <section className="chart-section">
      <ChartContainer 
        title="Single Pin Pressure Angle"
        tooltip="Variation of single tooth meshing pressure angle during one rotation period"
        chartRef={singlePinChartRef}
      />
      <ChartContainer 
        title="Average Pressure Angle"
        tooltip="Variation of multi-tooth meshing average pressure angle during one period"
        chartRef={averageChartRef}
      />
    </section>
  );
};

const ChartContainer = ({ title, tooltip, chartRef }) => (
  <div className="chart-container">
    <div className="chart-header">
      <h4>{title}</h4>
      <span className="info-icon tooltip" data-tooltip={tooltip}>?</span>
    </div>
    <canvas ref={chartRef} style={{ height: '260px' }} />
  </div>
);

export default ChartsSection;