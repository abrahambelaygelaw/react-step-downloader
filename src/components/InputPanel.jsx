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
      tooltip: 'Fixed Ring Diameter'
    },
    {
      id: 'numberOfExternalPins', // Changed from 'external_pins'
      label: 'Number of External Pins:',
      value: params.numberOfExternalPins,
      min: 5, max: 100, step: 1,
      tooltip: 'Number of External Pins'
    },
    {
      id: 'externalPinDiameter', // Changed from 'external_pin_diameter'
      label: 'External Pin Diameter:',
      value: params.externalPinDiameter,
      min: 0.1, max: 10, step: 0.1,
      tooltip: 'External Pin Diameter'
    },
    {
      id: 'numberOfOutputPins', // Changed from 'output_pins'
      label: 'Number of Output Pins:',
      value: params.numberOfOutputPins,
      min: 4, max: 100, step: 1,
      tooltip: 'Number of Output Pins'
    },
    {
      id: 'outputPinDiameter', // Changed from 'output_pin_diameter'
      label: 'Output Pin Diameter:',
      value: params.outputPinDiameter,
      min: 0.1, max: 10, step: 0.1,
      tooltip: 'Output Pin Diameter'
    },
    {
      id: 'outputDiskDiameter', // Changed from 'output_disk_diameter'
      label: 'Output Disk Diameter:',
      value: params.outputDiskDiameter,
      min: 1, max: 100, step: 0.1,
      tooltip: 'Output Disk Diameter'
    },
    {
      id: 'eccentricity', // This one was already correct
      label: 'Eccentricity:',
      value: params.eccentricity,
      min: 0, max: 1, step: 0.01,
      tooltip: 'Eccentricity'
    },
    {
      id: 'camshaftHole', // Changed from 'camshaft_hole'
      label: 'Camshaft Hole:',
      value: params.camshaftHole,
      min: 1, max: 20, step: 0.1,
      tooltip: 'Camshaft Hole'
    },
    {
      id: 'thickness', // This one was already correct
      label: 'STL Disk Thickness:',
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