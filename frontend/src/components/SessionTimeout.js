import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';

const SessionTimeout = () => {
  const dispatch = useDispatch();
  const [remainingTime, setRemainingTime] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    let timeoutId;

    const startSessionTimeout = () => {
      timeoutId = setTimeout(() => {
        dispatch(logout());
      }, remainingTime * 1000); // Convert remainingTime to milliseconds

      console.log(`Remaining time: ${remainingTime} seconds`);
    };

    const resetSessionTimeout = () => {
      clearTimeout(timeoutId);
      setRemainingTime(10 * 60); // Reset remaining time to 10 minutes
      startSessionTimeout();
    };

    // Start the session timeout when the component mounts
    startSessionTimeout();

    // Reset the session timeout whenever there is user activity
    window.addEventListener('mousemove', resetSessionTimeout);
    window.addEventListener('keydown', resetSessionTimeout);

    // Clean up event listeners when the component unmounts
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetSessionTimeout);
      window.removeEventListener('keydown', resetSessionTimeout);
    };
  }, [dispatch, remainingTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000); // Update remaining time every second

    return () => {
      clearInterval(timer);
    };
  }, []);

  // const Popup = () => {
  //   if (remainingTime <= 45) {
  //     return (
  //       <div className="popup-overlay">
  //         <div className="popup-container">
  //           <div className="popup-content">
  //             <p>Session will be logout in {remainingTime} seconds. Press any key to Continu</p>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return null;
  //   }
  // };

  return null;
};

export default SessionTimeout;
