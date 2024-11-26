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
  const [isExceeding, setIsExceeding] = useState(false);

  const handleReset = () => {
    setCurrentSum(0);
    setAddedFractions([]);
    setIsExceeding(false);
  };

  const handleDrop = (fraction: string) => {
    const fractionValue = FRACTIONS[fraction as keyof typeof FRACTIONS];
    const newSum = currentSum + fractionValue;

    setCurrentSum(newSum);
    setAddedFractions([...addedFractions, fractionValue]);
    
    const exceeding = newSum > 1;
    setIsExceeding(exceeding);

    setTimeout(() => {
      if (Math.abs(newSum - 1) < 1e-9) {
        alert("Yes ! Congratulations! You've reached 1! You won the game!");
        handleReset();
      } else if (exceeding) {
        alert("Aww No ! The sum has exceeded 1! Try again!");
        handleReset();
      }
    }, 1000);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.leftPanel}>
        <PieChart fractions={addedFractions} />
        <div className={`${styles.score} ${isExceeding ? styles.exceeding : ''}`}>
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