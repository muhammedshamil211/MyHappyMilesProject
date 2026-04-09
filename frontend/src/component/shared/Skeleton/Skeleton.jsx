import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, variant = 'text', className = '' }) => {
  const style = {
    width: width ? width : '100%',
    height: height ? height : '16px',
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
