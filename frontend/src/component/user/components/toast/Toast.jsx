import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Map the type to the specific class in the CSS Module
  const typeClass = styles[type] || styles.success;

  return (
    <div className={`${styles.toastContainer} ${typeClass}`}>
      <span className={styles.icon}>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <p className={styles.message}>{message}</p>
      <button className={styles.closeBtn} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Toast;