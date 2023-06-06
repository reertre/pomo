import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { Section, Button, ButtonGroup } from '@barclays/blueprint-react';

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(60);
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
        setTimeRemaining(60);
        setIsBreak(true);
      } else {
        setTimeRemaining(60);
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

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <Section>
          <section>
            <div className={styles.Pomodoro}>
              <h1>Pomodoro</h1>
              <div className={styles.timerWrapper}>
                <div className={`${styles.timerCircle} ${timerRunning ? styles.timerRunning : ""}`} />
                {renderTime({ remainingTime: timeRemaining })}
              </div>
            </div>
          </section>

          <div className={styles.timerControls}>
            <ButtonGroup>
              <Button onClick={startTimer}>Start</Button>
              <Button onClick={stopTimer}>Stop</Button>
              <Button onClick={resetTimer}>Reset</Button>
            </ButtonGroup>
          </div>
        </Section>
      </section>
    </div>
  );
};

export default Pomodoro;
