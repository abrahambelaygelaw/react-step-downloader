// components/OutputPanel.js
import React, { useState } from 'react';
import FileSaver from "file-saver";
import { wrap } from "comlink";
import cadWorker from "../worker.js?worker";
import { drawCycloid2D } from '../cycloid-2d';
const cad = wrap(new cadWorker());
const OutputPanel = ({ results,params }) => {
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
      
      <DownloadButtons params={params} />
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

const DownloadButtons = ({params}) => {
  const [isLoading, setIsLoading] = useState({
    dxf: false,
    stl: false,
    step: false
  });
  // const fileName = 

  const setLoading = (format, loading) => {
    setIsLoading(prev => ({ ...prev, [format]: loading }));
  };

  const exportStep = async  () => {
      if(params.phase === 1){
       await downloadSTEP(1);
      }
      else if(params.phase === 2){
       await downloadSTEP(1);
       await downloadSTEP(2);
      }
      else if(params.phase === 3){
        await downloadSTEP(1);
       await  downloadSTEP(2);
        await downloadSTEP(3);
      }
  };

  const exportSTL = async () => {
    
      if(params.phase === 1){
     await downloadSTL(1);
      }
      else if(params.phase === 2){
        await downloadSTL(1);
        await downloadSTL(2);
      }
      else if(params.phase === 3){
       await  downloadSTL(1);
       await  downloadSTL(2);
       await  downloadSTL(3);
      }
    
    }
  const exportDXF = () => {
      if(params.phase === 1){
        downloadDXF(1);
      }
      else if(params.phase === 2){
        downloadDXF(1);
        downloadDXF(2);
      }
      else if(params.phase === 3){
        downloadDXF(1);
        downloadDXF(2);
        downloadDXF(3);
      }
     
    
  };
  const downloadDXF = (disk) => {
    const dxfstring = drawCycloid2D(params,disk);
    FileSaver.saveAs(new Blob([dxfstring], {type: "application/dxf"}), `cycloid-${disk}.dxf`);
  }
  const downloadSTL = async (disk)=>{
    setLoading("stl", true)
    try {

      const blob = await cad.createSTLBlob(params,disk);
      FileSaver.saveAs(blob, `cycloid-${disk}.stl`);
    } finally {
    setLoading("stl", false)}
  }
    const downloadSTEP = async (disk)=>{
      setLoading('step', true);
    try {
      const blob = await cad.createSTEPBlob(params,disk);
      FileSaver.saveAs(blob, `cycloid-${disk}.step`);
    } finally {
      setLoading('step', false);
    }
  }

  return (
    <>
      <div className="output-container">
        <button 
          id="download_dxf" 
          onClick={exportDXF} 
          className="download_button"
          disabled={isLoading.dxf}
        >
          {isLoading.dxf ? 'Generating DXF...' : 'Download Cycloid Profile (DXF format)'}
        </button>
        <span className="info-icon tooltip" data-tooltip="Download model in DXF(2D) format.">?</span>
      </div>
      <div className="output-container">
        <button 
          id="download_stl" 
          onClick={exportSTL} 
          className="download_button"
          disabled={isLoading.stl}
        >
          {isLoading.stl ? 'Generating STL...' : 'Download Cycloid Profile (STL format)'}
        </button>
        <span className="info-icon tooltip" data-tooltip="Download model in STL(3D) format.">?</span>
      </div>
      <div className="output-container">
        <button 
          id="download_step" 
          onClick={exportStep}
          className="download_button"
          disabled={isLoading.step}

        >
          {isLoading.step ? 'Generating STEP...' : 'Download Cycloid Profile (STEP format)'}
        </button>
        <span className="info-icon tooltip" data-tooltip="Download model in STEP(3D) format.">?</span>
      </div>
    </>
  )};


export default OutputPanel;