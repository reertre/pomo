import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Controls from "./Controls";
import CardContent from "./CardContent";

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(6 * 60); // 6 minutes
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState("pomo");

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(6 * 60); // Reset to 6 minutes for pomodoro mode
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleModeChange = (event) => {
    setTimerMode(event.target.id);
    switch (event.target.id) {
      case "pomo":
        setTimeRemaining(6 * 60); // 6 minutes
        break;
      case "short":
        setTimeRemaining(30); // 30 seconds
        break;
      case "long":
        setTimeRemaining(60 * 60); // 60 minutes
        break;
      default:
        setTimeRemaining(6 * 60); // Default to pomodoro mode
    }
  };

  useEffect(() => {
    let intervalId;

    if (timerRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, timeRemaining]);

  const calculateProgress = () => {
    return (timeRemaining / (timerMode === "long" ? 60 * 60 : 6 * 60)) * 100;
  };

  const renderTime = ({ remainingTime }) => {
    return (
      <div className={styles.timerText}>
        {formatTime(remainingTime)}
      </div>
    );
  };

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <section>
          <div className={styles.Pomodoro}>
            <Controls
              timerMode={timerMode}
              setTimerMode={setTimerMode}
              handleModeChange={handleModeChange}
            />
            <div className={styles.timerwrapper}>
              <CountdownCircleTimer
                isPlaying={timerRunning}
                duration={calculateTotalDuration()}
                colors={[["#2D27DC"]]}
                strokeWidth={8}
                size={240}
                onComplete={() => setIsBreak(true)}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
          </div>
        </section>
        <div className={styles.timerControls}>
          <button onClick={startTimer}>Start</button>
          <button onClick={stopTimer}>Stop</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </section>
      {(!isBreak && timeRemaining === 0) || (timerMode !== "pomo" && timeRemaining === 0) ? (
    </div>
  );
};

export default Pomodoro;
