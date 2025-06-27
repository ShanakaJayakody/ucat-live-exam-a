import React, { useState, useEffect } from 'react';

interface Props {
  durationInSeconds: number;
  onComplete: () => void;
}

// NOTE: We are changing this to a named export to be consistent.
export const Timer: React.FC<Props> = ({ durationInSeconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    // If the timer reaches zero, call the onComplete function and stop.
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    // Set up an interval to decrease the timer by 1 every second.
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // This is a cleanup function that runs when the component is unmounted.
    // It prevents memory leaks by clearing the interval.
    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  // Logic to display the time in MM:SS format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div id="timer" className="text-base px-3 py-1 rounded-md">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}; 