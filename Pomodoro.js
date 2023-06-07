import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { push as Menu } from "react-burger-menu";
import { Section, Button, ButtonGroup } from '@barclays/blueprint-react';
import styles from "./pomodoro.module.css";

const SidebarContent = () => {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Timer
      </a>
      <a className="menu-item" href="/">
        Stats
      </a>
      <a className="menu-item" href="/">
        Settings
      </a>
    </Menu>
  );
};

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
      <div className={styles.timerText}>
        <span>{formatTime(timeRemaining)}</span>
        {isBreak ? <p>Break</p> : <p>Focus</p>}
      </div>
    );
  };

  return (
    <div className={styles.pomodoroPage}>
      <Menu
        className={styles.sidebar}
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
      >
        <SidebarContent />
      </Menu>
      <div id="outer-container">
        <main id="page-wrap">
          <Section>
            <section>
              <h1>Pomodoro</h1>
              <div className={styles.timerWrapper}>
                <CircularProgressbar
                  value={calculateProgress()}
                  text={formatTime(timeRemaining)}
                  strokeWidth={10}
                />
              </div>
              {renderTime({ remainingTime: timeRemaining })}
            </section>
          </Section>

          <Section>
            <section>
              <div className={styles.timerControls}>
                <ButtonGroup>
                  <Button onClick={startTimer}>Start</Button>
                  <Button onClick={stopTimer}>Stop</Button>
                  <Button onClick={resetTimer}>Reset</Button>
                </ButtonGroup>
              </div>
            </section>
          </Section>
        </main>
      </div>
    </div>
  );
};

export default Pomodoro;
