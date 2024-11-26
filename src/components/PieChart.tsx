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

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw white background circle
    ctx.beginPath();
    ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS + 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw main circle outline
    ctx.beginPath();
    ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    if (fractions.length > 0) {
      let startAngle = 0;

      fractions.forEach(fraction => {
        const extentAngle = fraction * 2 * Math.PI;

        // Draw white outline - increased size from +1 to +3
        ctx.beginPath();
        ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS + 3, startAngle, startAngle + extentAngle);
        ctx.lineTo(CIRCLE_CENTER, CIRCLE_CENTER);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw blue slice with white outline - added lineWidth
        ctx.beginPath();
        ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, startAngle, startAngle + extentAngle);
        ctx.lineTo(CIRCLE_CENTER, CIRCLE_CENTER);
        ctx.fillStyle = 'blue';
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