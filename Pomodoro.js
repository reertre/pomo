import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./pomodoro.module.css";
import { Section, Button, ButtonGroup } from '@barclays/blueprint-react';

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
      <div className={styles.timerText}>
        <span>{formatTime(timeRemaining)}</span>
        {isBreak ? <p>Break</p> : <p>Focus</p>}
      </div>
    );
  };

  const progress = (25 * 60 - timeRemaining) / (25 * 60) * 100;

  return (
    <div className={styles.pomodoroPage}>
      <Section>
        <section>
          <div className={styles.Pomodoro}>
            <h1 styles={{ marginTop: "20px", padding: "20px" }}>Pomodoro</h1>
            <div className={styles.timerWrapper}>
              <div className={styles.timerCircle}>
                <CircularProgressbar
                  value={progress}
                  text={formatTime(timeRemaining)}
                  styles={buildStyles({
                    textColor: "#fff",
                    pathColor: "#004777",
                    trailColor: "#f0f0f0",
                  })}
                />
              </div>
            </div>
          </div>
        </section>

        <div className={styles.timerControls}>
          <ButtonGroup>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
          </ButtonGroup>
        </div>
      </Section>
    </div>
  );
};

export default Pomodoro;
