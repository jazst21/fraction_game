import React, { useEffect, useRef } from 'react';
import styles from './PieChart.module.css';

interface PieChartProps {
  fractions: number[];
}

const CANVAS_SIZE = 300;
const CIRCLE_CENTER = 150;
const CIRCLE_RADIUS = 100;

export const PieChart: React.FC<PieChartProps> = ({ fractions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.beginPath();
    ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS + 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    if (fractions.length > 0) {
      let startAngle = 0;
      let runningSum = 0;

      fractions.forEach((fraction, index) => {
        runningSum += fraction;
        const extentAngle = fraction * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, startAngle, startAngle + extentAngle);
        ctx.lineTo(CIRCLE_CENTER, CIRCLE_CENTER);
        
        // Only use red for the last piece if it makes the sum exceed 1
        const isLastPiece = index === fractions.length - 1;
        ctx.fillStyle = (isLastPiece && runningSum > 1) ? '#ffcccc' : 'blue';
        
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();

        startAngle += extentAngle;
      });
    }
  }, [fractions]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className={styles.pieChart}
    />
  );
}; 