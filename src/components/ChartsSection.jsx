// components/ChartsSection.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartsSection = ({ driveRef, params }) => {
  const singlePinChartRef = useRef(null);
  const averageChartRef = useRef(null);
  const singlePinChartInstance = useRef(null);
  const averageChartInstance = useRef(null);
  useEffect(() => {
    if (!driveRef.current) return;

    // Generate sample chart data (replace with actual calculations from engine)
    const generateChartData = () => {
      function generateAngles() {
        return Array.from({ length: 361 }, (_, i) => (i * 361) / 360);
      }
      const pressureAngle = (theta_p, e, r_p, r_pc, z_p, z_c) => {
        return theta_p.map((theta) => {
          const normalizedTheta = theta % 360.0;
          const theta_rad = (normalizedTheta * Math.PI) / 180;

          const i_h = z_p / z_c;
          const k1 = (e * z_p) / r_pc;
          const S = 1 + k1 ** 2 - 2 * k1 * Math.cos(theta_rad);
          const sqrtS = Math.sqrt(S);

          // Normal vector components with precise normalization
          const nc_x =
            -Math.cos((i_h - 1) * theta_rad) +
            k1 * Math.cos(i_h * theta_rad);
          const nc_y =
            Math.sin((i_h - 1) * theta_rad) -
            k1 * Math.sin(i_h * theta_rad);
          const normFactor = 1 / sqrtS;

          // Velocity vector components with precise floating-point handling
          const vc_x =
            -r_pc * Math.sin((1 - i_h) * theta_rad) -
            e * Math.sin(i_h * theta_rad) +
            r_p *
              (Math.sin((1 - i_h) * theta_rad) +
                k1 * Math.sin(i_h * theta_rad)) *
              normFactor;

          const vc_y =
            r_pc * Math.cos((i_h - 1) * theta_rad) -
            e * Math.cos(i_h * theta_rad) +
            r_p *
              (-Math.cos((i_h - 1) * theta_rad) +
                k1 * Math.cos(i_h * theta_rad)) *
              normFactor;

          // Calculate pressure angle with epsilon comparison
          const dotProduct =
            vc_x * nc_x * normFactor + vc_y * nc_y * normFactor;
          const vc_magnitude = Math.hypot(vc_x, vc_y);
          const alpha_rad = Math.acos(
            Math.min(Math.max(dotProduct / vc_magnitude, -1), 1)
          ); // Clamp to valid range
          return {
            theta_deg: theta,
            alpha_deg: (alpha_rad * 180) / Math.PI,
          };
        });
      };
    const chartParameter = {
      e: params.eccentricity,
      r_p : params.externalPinDiameter / 2,
      r_pc : params.fixedRingDiameter / 2,
      z_p : params.numberOfExternalPins,
      z_c : params.numberOfExternalPins-1,
      angles: generateAngles()
    }
    const results = {
      singlePin : pressureAngle(
        chartParameter.angles,
        chartParameter.e,
        chartParameter.r_p,
        chartParameter.r_pc,
        chartParameter.z_p,
        chartParameter.z_c
      ),
      allPins : Array.from({ length: chartParameter.z_p},(_,k)=>{
        const shiftedAngles = chartParameter.angles.map(
          (theta)=> theta + (k*360)/chartParameter.z_p
        )
        return pressureAngle(
          shiftedAngles,
          chartParameter.e,
          chartParameter.r_p,
          chartParameter.r_pc,
          chartParameter.z_p,
          chartParameter.z_c
        )
      })
    }

    const epsilon = 1e-6;
    const avgData = results.allPins[0].map((_, j)=>{
      let sum = 0
      let  count = 0
      results.allPins.forEach((pinData,k)=>{
        const value = pinData[j].alpha_deg
        if(!(j==0 && k ===0 && Math.abs(value-90)<epsilon)){
          if(value <= 90 + epsilon){
            sum += value
            count += 1
          }
        }

      })
      return count > 0 ? sum / count / 2 :0 
    })
    

      const angles = chartParameter.angles
      const singlePinData = results.singlePin
      const averageData = avgData      

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
          data: singlePinData.map((d)=>d.alpha_deg),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.1,
          pointRadius: 0
        }]
      },
      options: {
        elements: {
          point: {
            radius: 3,
          },
          line: {
            borderWidth: 0.5,
          },
        },
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