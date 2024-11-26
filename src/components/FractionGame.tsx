import React, { useState } from 'react';
import { PieChart } from './PieChart';
import { DraggableFraction } from './DraggableFraction';
import styles from './FractionGame.module.css';

const FRACTIONS = {
  "1": 1,
  "1/2": 0.5,
  "1/3": 1/3,
  "1/4": 0.25,
  "1/8": 0.125
};

export const FractionGame: React.FC = () => {
  const [currentSum, setCurrentSum] = useState(0);
  const [addedFractions, setAddedFractions] = useState<number[]>([]);

  const handleDrop = (fraction: string) => {
    const fractionValue = FRACTIONS[fraction as keyof typeof FRACTIONS];
    const newSum = currentSum + fractionValue;

    if (newSum <= 1) {
      setCurrentSum(newSum);
      setAddedFractions([...addedFractions, fractionValue]);

      if (Math.abs(newSum - 1) < 1e-9) {
        alert("Congratulations! You've reached 1! You won the game!");
      }
    } else {
      alert("Adding this fraction would exceed 1!");
    }
  };

  const handleReset = () => {
    setCurrentSum(0);
    setAddedFractions([]);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.leftPanel}>
        <PieChart fractions={addedFractions} />
        <div className={styles.score}>
          Current Sum: {currentSum.toFixed(3)}
        </div>
      </div>
      <div className={styles.rightPanel}>
        {Object.keys(FRACTIONS).map((fraction) => (
          <DraggableFraction
            key={fraction}
            fraction={fraction}
            onDrop={handleDrop}
          />
        ))}
        <button 
          className={styles.resetButton}
          onClick={handleReset}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}; 