// components/ChartsSection.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartsSection = ({ driveRef }) => {
  const singlePinChartRef = useRef(null);
  const averageChartRef = useRef(null);
  const singlePinChartInstance = useRef(null);
  const averageChartInstance = useRef(null);

  useEffect(() => {
    if (!driveRef.current) return;

    // Generate sample chart data (replace with actual calculations from engine)
    const generateChartData = () => {
      const angles = Array.from({ length: 361 }, (_, i) => i);
      const singlePinData = angles.map(angle => 
        40 + 10 * Math.sin(angle * Math.PI / 180) + Math.random() * 5
      );
      const averageData = angles.map(angle => 
        35 + 5 * Math.cos(angle * Math.PI / 90) + Math.random() * 2
      );
      
      return { angles, singlePinData, averageData };
    };

    const { angles, singlePinData, averageData } = generateChartData();

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
          data: singlePinData,
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
            title: {
              display: true,
              text: 'Rotation Angle (degrees)'
            },
            min: 0,
            max: 360
          },
          y: {
            title: {
              display: true,
              text: 'Pressure Angle (degrees)'
            }
          }
        }
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
            title: {
              display: true,
              text: 'Rotation Angle (degrees)'
            },
            min: 0,
            max: 360
          },
          y: {
            title: {
              display: true,
              text: 'Pressure Angle (degrees)'
            }
          }
        }
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