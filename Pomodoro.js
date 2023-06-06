import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(25 * 60);
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
  };

  const calculateProgress = () => {
    const progress = ((25 * 60 - timeRemaining) / (25 * 60)) * 100;
    return progress > 100 ? 100 : progress;
  };

  useEffect(() => {
    let intervalId;

    if (timerRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerRunning && timeRemaining === 0) {
      clearInterval(intervalId);

      if (!isBreak) {
        setTimeRemaining(5 * 60);
        setIsBreak(true);
      } else {
        setTimeRemaining(25 * 60);
        setIsBreak(false);
      }
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, timeRemaining, isBreak]);

  return (
    <div className="pomodoro">
      <div className="timer">
        <h1>Pomodoro</h1>
        <div className="timer-circle">
          <div className="timer-progress" style={{ width: calculateProgress() + "%" }}></div>
          <div className="timer-text">
            <span>{formatTime(timeRemaining)}</span>
            {isBreak ? <p>Break</p> : <p>Focus</p>}
          </div>
        </div>
        <div className="timer-controls">
          <button onClick={startTimer}>Start</button>
          <button onClick={stopTimer}>Stop</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying={timerRunning}
          duration={timeRemaining}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => {
            setTimerRunning(false);
            setTimeRemaining(25 * 60);
            setIsBreak(!isBreak);
          }}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </div>
  );
};

export default Pomodoro;
