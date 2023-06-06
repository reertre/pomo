import React, { useEffect, useState } from "react";
import styles from './pomodoro.module.css';
import { Section, Hero, Button, Type, Modal, ButtonGroup } from '@barclays/blueprint-react';
import { useRouter } from 'next/router';

function Pomodoro() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false); // options: pomo, short, long
  const router = useRouter();

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

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className='pomodoroPage'>
      <section>
        <Section>
          <div className={styles.dWvsAf}>
            <h1 className={styles.container}>Pomodoro</h1>
          </div>
          <div className={styles.krmWQa}>
            <div>
              <span>{formatTime(timeRemaining)}</span>
              {isBreak ? <p>Break</p> : <p>Focus</p>}
              <button className={styles.timerButton} onClick={startTimer}>Start</button>
              <button className={styles.timerButton} onClick={stopTimer}>Stop</button>
              <button className={styles.timerButton} onClick={resetTimer}>Reset</button>
            </div>
            <ButtonGroup>
              <Button onClick={() => router.replace('/')}>Back to Home</Button>
            </ButtonGroup>
          </div>
        </Section>
      </section>
    </div>
  );
}

export default Pomodoro;
