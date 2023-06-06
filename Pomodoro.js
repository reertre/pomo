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

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className={styles.timer}>Too late...</div>;
    }

    return (
      <div className={styles.timer}>
        <div className={styles.timerCircle}>
          <div className={styles.timerProgress} style={{ width: calculateProgress() + "%" }}></div>
          <div className={styles.timerText}>
            <span>{formatTime(timeRemaining)}</span>
            {isBreak ? <p>Break</p> : <p>Focus</p>}
          </div>
        </div>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.pomodoro}>
        <h1 style={{marginTop: "20px"}}>Pomodoro</h1>
        <div className={styles.timerWrapper}>
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
    </div>
  );
};

export default Pomodoro;
