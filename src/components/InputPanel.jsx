// components/InputPanel.js
import React from 'react';
import InputGroup from './InputGroup';

const InputPanel = ({ params, onParamChange }) => {

  
  const inputGroups = [
    {
      id: 'inputSpeed', // Changed from 'input_speed'
      label: 'Input speed:',
      value: params.inputSpeed,
      min: 0, max: 50, step: 1,
      tooltip: 'Input shaft rotation speed.'
    },
    {
      id: 'fixedRingDiameter', // Changed from 'fixed_ring_diameter'
      label: 'Fixed Ring Diameter:',
      value: params.fixedRingDiameter,
      min: 1, max: 200, step: 0.5,
      tooltip: 'Fixed Ring Diameter',
      img : "Fixed_ring_diameter.jpg"
    },
    {
      id: 'numberOfExternalPins', // Changed from 'external_pins'
      label: 'Number of External Pins:',
      value: params.numberOfExternalPins,
      min: 5, max: 100, step: 1,
      tooltip: 'Number of External Pins',
      img : "Number_external_pins.jpg"
    },
    {
      id: 'externalPinDiameter', // Changed from 'external_pin_diameter'
      label: 'External Pin Diameter:',
      value: params.externalPinDiameter,
      min: 0.1, max: 10, step: 0.1,
      tooltip: 'External Pin Diameter',
      img : "Pin_diameter.jpg",
    },
    {
      id: 'numberOfOutputPins', // Changed from 'output_pins'
      label: 'Number of Output Pins:',
      value: params.numberOfOutputPins,
      min: 4, max: 100, step: 1,
      tooltip: 'Number of Output Pins',
      img : "Number_output_pins.jpg"
    },
    {
      id: 'outputPinDiameter', // Changed from 'output_pin_diameter'
      label: 'Output Pin Diameter:',
      value: params.outputPinDiameter,
      min: 0.1, max: 10, step: 0.1,
      tooltip: 'Output Pin Diameter',
      img : "Roller_pin_diameter.jpg"
    },
    {
      id: 'outputDiskDiameter', // Changed from 'output_disk_diameter'
      label: 'Output Disk Diameter:',
      value: params.outputDiskDiameter,
      min: 1, max: 100, step: 0.1,
      tooltip: 'Output Disk Diameter',
      img : "Roller_disc_diameter.jpg"
    },
    {
       id: "numberOfLobes", // Changed from 'lobes'
       label: "Number of Lobes:",
        value: params.numberOfLobes,
        min: 1, max: 10, step: 1,
        tooltip: "Number of Lobes",
        img : "Number_lobes.jpg",
        disabled : true
    },
    {
      id: 'eccentricity', // This one was already correct
      label: 'Eccentricity:',
      value: params.eccentricity,
      min: 0, max: 1, step: 0.01,
      tooltip: 'Eccentricity',
      img : "Eccentricity.jpg"
    },
    {
      id: 'camshaftHole', // Changed from 'camshaft_hole'
      label: 'Camshaft Hole:',
      value: params.camshaftHole,
      min: 1, max: 20, step: 0.1,
      tooltip: 'Camshaft Hole',
      img : "Camshaft_hole_diameter.jpg"
    },
    {
      id: 'thickness', // This one was already correct
      label: 'Disk Thickness:',
      value: params.thickness,
      min: 0.25, max: 5, step: 0.1,
      tooltip: 'Thickness of the 3D model.'
    }
  ];

  return (
    <div className="input-fields">
      {inputGroups.map(group => (
        <InputGroup
          key={group.id}
          {...group}
          onChange={(value) => onParamChange(group.id, value)}
        />
      ))}
    </div>
  );
};

export default InputPanel;