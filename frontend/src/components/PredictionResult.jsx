import React from 'react';
import MrittikaAI from './MrittikaAI';

export const PredictionResult = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <MrittikaAI
      state="success"
      result={result}
      onReset={onReset}
      className="animate-fadeIn"
    />
  );
};

export default PredictionResult;
