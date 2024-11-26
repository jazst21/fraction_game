import React from 'react';
import styles from './DraggableFraction.module.css';

interface DraggableFractionProps {
  fraction: string;
  onDrop: (fraction: string) => void;
}

export const DraggableFraction: React.FC<DraggableFractionProps> = ({ 
  fraction, 
  onDrop 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('fraction', fraction);
  };

  return (
    <div
      className={styles.fractionButton}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onDrop(fraction)}
    >
      {fraction}
    </div>
  );
}; 