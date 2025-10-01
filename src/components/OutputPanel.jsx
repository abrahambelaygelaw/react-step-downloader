// components/OutputPanel.js
import React from 'react';

const OutputPanel = ({ results }) => {
  const outputItems = [
    {
      id: 'transmission_ratio',
      label: 'Transmission Ratio:',
      value: results.transmissionRatio,
      tooltip: 'Ratio of Transmission.'
    },
    {
      id: 'output_speed',
      label: 'Output speed:',
      value: results.outputSpeed,
      tooltip: 'Output Rotation Speed in Radians/seconds.'
    },
    {
      id: 'average_pressure_angle',
      label: 'Average Pressure Angle',
      value: results.averagePressureAngle,
      tooltip: 'Average pressure angle during one period'
    },
    {
      id: 'pressure_angle_range',
      label: 'Range',
      value: results.pressureAngleRange,
      tooltip: 'Multi-tooth average pressure angle variation'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className="dropdown-container">
      <div className="dropdown">
        <button className="dropbtn">
          Input: Eccentric Shaft<br />Output: Pin disk
        </button>
      </div>
      
      <div className="output-boxes">
        {outputItems.map(item => (
          <OutputItem key={item.id} {...item} />
        ))}
      </div>
      
      <DownloadButtons />
    </div>
  );
};

const OutputItem = ({ label, value, tooltip }) => (
  <div className="output-container">
    <div className="output-box">
      <div className="output-label">{label}</div>
      <span className="dynamic-content">{value}</span>
    </div>
    <span className="info-icon" data-tooltip={tooltip}>?</span>
  </div>
);

const DownloadButtons = () => {
    const exportStep = () => {
      console.log("Exporting STEP file...");
    }
  
  return (
  <>
    <div className="output-container">
      <button id="download_dxf" className="download_button">
        Download Cycloid Profile (DXF format)
      </button>
      <span className="info-icon tooltip" data-tooltip="Download model in DXF(2D) format.">?</span>
    </div>
    <div className="output-container">
      <button id="download_stl" className="download_button">
        Download Cycloid Profile (STL format)
      </button>
      <span className="info-icon tooltip" data-tooltip="Download model in STL(3D) format.">?</span>
    </div>
    <div className="output-container">
      <button id="download_step" onClick={
        exportStep}
       className="download_button">
        Download Cycloid Profile (STEP format)
      </button>
      <span className="info-icon tooltip" data-tooltip="Download model in STL(3D) format.">?</span>
    </div>
  </>
)};

export default OutputPanel;