import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { Section, Button, ButtonGroup } from "@barclays/blueprint-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  const calculateProgress = () => {
    const progress = ((60 - timeRemaining) / 60) * 100;
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
        setTimeRemaining(60);
        setIsBreak(true);
      } else {
        setTimeRemaining(60);
        setIsBreak(false);
      }
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, timeRemaining, isBreak]);

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <Section>
          <section>
            <div className={styles.Pomodoro}>
              <h1>Pomodoro</h1>
              <div className={styles.timerWrapper}>
                <CircularProgressbar
                  value={calculateProgress()}
                  text={formatTime(timeRemaining)}
                  strokeWidth={10}
                  styles={{
                    root: { width: "100%", height: "100%" },
                    path: { stroke: "#004777" },
                    trail: { stroke: "#f7f7f7" },
                    text: { fill: "#fff", fontSize: "24px", fontWeight: "bold" },
                  }}
                />
              </div>
            </div>
          </section>
        </Section>

        <div className={styles.timerControls}>
          <ButtonGroup>
            <button onClick={startTimer}>Start</button>
            <button onClick={stopTimer}>Stop</button>
            <button onClick={resetTimer}>Reset</button>
          </ButtonGroup>
        </div>
        <Section></Section>
      </section>
    </div>
  );
};

export default Pomodoro;
