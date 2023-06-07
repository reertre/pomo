import React, { useState } from "react";
import styles from "./pomodoro.module.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "react-sidebar";
import { Section, Button, ButtonGroup } from "@barclays/blueprint-react";

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  const sidebarContent = (
    <div>
      <h2>Sidebar</h2>
      <ul>
        <li>Menu Item 1</li>
        <li>Menu Item 2</li>
        <li>Menu Item 3</li>
      </ul>
    </div>
  );

  return (
    <div className={styles.pomodoroPage}>
      <Sidebar
        sidebar={sidebarContent}
        open={isSidebarOpen}
        onSetOpen={setSidebarOpen}
        styles={{ sidebar: { background: "#f5f5f5", width: "20%" } }}
      >
        <Section>
          <Button onClick={() => setSidebarOpen(true)}>Open Sidebar</Button>

          <div className={styles.mainContent}>
            <h1 style={{ marginTop: "20px", padding: "10px" }}>Pomodoro</h1>
            <div className={styles.timerWrapper}>
              <CircularProgressbar
                value={calculateProgress()}
                text={formatTime(timeRemaining)}
                strokeWidth={10}
              />
              {renderTime({ remainingTime: timeRemaining })}
            </div>

            <div className={styles.timerControls}>
              <ButtonGroup>
                <Button onClick={startTimer}>Start</Button>
                <Button onClick={stopTimer}>Stop</Button>
                <Button onClick={resetTimer}>Reset</Button>
              </ButtonGroup>
            </div>
          </div>
        </Section>
      </Sidebar>
    </div>
  );
};

export default Pomodoro;
