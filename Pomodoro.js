import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./pomodoro.module.css";

const Pomodoro = () => {
  const [timerRunning, setTimerRunning] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className={styles.timer}>Too late...</div>;
    }

    return (
      <div className={styles.timer}>
        <div className={styles.timerCircle}>
          <CountdownCircleTimer
            isPlaying={timerRunning}
            duration={25 * 60}
            colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
            strokeWidth={12}
            size={240}
            trailColor="#f4f4f4"
            onComplete={() => {
              setTimerRunning(false);
            }}
          >
            {({ remainingTime }) => (
              <div className={styles.timerText}>
                <span>{remainingTime}</span>
                <p>Focus</p>
              </div>
            )}
          </CountdownCircleTimer>
        </div>
        <div className={styles.timerControls}>
          <button onClick={startTimer}>Start</button>
          <button onClick={stopTimer}>Stop</button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pomodoroPage}>
      <div className={styles.pomodoro}>
        <h1>Pomodoro</h1>
        <div className={styles.timerWrapper}>{renderTime}</div>
      </div>
    </div>
  );
};

export default Pomodoro;
