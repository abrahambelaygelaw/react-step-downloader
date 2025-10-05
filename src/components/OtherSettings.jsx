// components/OtherSettings.jsx
import React, { useState } from 'react';

const OtherSettings = ({ params, onParamChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="collapsible-container">
      <label className="collapsible-label">Other Settings</label>
      <div 
        className={`collapse_btn ${isCollapsed ? 'chevron' : 'rotated-chevron'}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      ></div>
      
      <div className="collapsible-content" style={{ display: isCollapsed ? 'none' : 'block' }}>
        <div className="collapsible-dropdown">
          <label>Phase Type (Number of External Pins must be divisible by phase value)</label><br />
          <input
            type="radio"
            id="phase_1"
            name="phase_value"
            value="1"
            checked={params.phase === 1}
            onChange={() => onParamChange('phase', 1)}
          />
          <label htmlFor="phase_1">Phase 1</label><br />
          
          <input 
            type="radio" 
            id="phase_2" 
            name="phase_value" 
            value="2" 
            checked={params.phase === 2}
            onChange={() =>{
              if(params.numberOfExternalPins % 2 !== 0){
                document.getElementById('phase_1').checked = true;
                onParamChange('phase', 1);

              } else {
                onParamChange('phase', 2)}}

              }
                
          />
          <label htmlFor="phase_2">Phase 2</label><br />
          
          <input 
            type="radio" 
            id="phase_3" 
            name="phase_value" 
            value="3" 
            checked={params.phase === 3}
            onChange={() => {
              if(params.numberOfExternalPins % 3 !== 0){
                document.getElementById('phase_1').checked = true;
                onParamChange('phase', 1);

              } else {
              onParamChange('phase', 3)}}
            }
          />
          <label htmlFor="phase_3">Phase 3</label><br />
        </div>
        
        <div className="input-group disk-clearance">
          <label htmlFor="outer_ring_disk_clearance" className="color-blue">
            Disk and Outer Ring:
          </label>
          <input
            type="number"
            id="outer_ring_disk_clearance"
            value={params.outerRingDiskClearance}
            step="0.1"
            className="input-box"
            onChange={(e) => onParamChange('outerRingDiskClearance', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherSettings;