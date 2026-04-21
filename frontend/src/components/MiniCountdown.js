import React, { useState, useEffect } from 'react';

const MiniCountdown = ({ endTime }) => {
  const [countdown, setCountdown] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endTime).getTime() - now;

      if (distance <= 0) {
        clearInterval(timerInterval);
        setCountdown("CLOSED");
        setIsExpired(true);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (days > 0) setCountdown(`${days}d ${hours}h`);
        else if (hours > 0) setCountdown(`${hours}h ${minutes}m`);
        else setCountdown(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [endTime]);

  if (!endTime) return null;

  return (
    <div 
      className="d-inline-flex align-items-center justify-content-center px-3 py-1 rounded-pill"
      style={{
        backgroundColor: isExpired ? 'rgba(220, 53, 69, 0.9)' : 'rgba(11, 21, 33, 0.9)',
        border: `1px solid ${isExpired ? '#dc3545' : 'rgba(57, 255, 20, 0.4)'}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}
    >
      <i 
        className="far fa-clock mr-2" 
        style={{ color: isExpired ? '#fff' : '#39ff14', fontSize: '0.9rem' }}
      ></i>
      <span 
        className="font-weight-bold" 
        style={{ 
          color: isExpired ? '#fff' : '#39ff14', 
          fontSize: '0.9rem',
          letterSpacing: '1px'
        }}
      >
        {countdown}
      </span>
    </div>
  );
};

export default MiniCountdown;
