import React, { useEffect, useState } from "react";
import styles from './pomodoro.module.css';
import { Section, Button, ButtonGroup } from '@barclays/blueprint-react';
import { useRouter } from 'next/router';

// CountdownTimer component code
const CountdownTimer = (props) => {
  const { seconds, size, strokeBgColor, strokeColor, strokeWidth } = props;
  const [countdown, setCountdown] = useState(seconds * 1000);
  const [isPlaying, setPlaying] = useState(false);
  const radius = size / 2;
  const circumference = size * Math.PI;

  const strokeDashoffset = () =>
    circumference - (countdown / (seconds * 1000)) * circumference;

  useEffect(() => {
    let intervalId;

    if (isPlaying && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevTime) => prevTime - 10);
      }, 10);
    } else if (isPlaying && countdown === 0) {
      clearInterval(intervalId);
      setCountdown(seconds * 1000);
      setPlaying(false);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, countdown, seconds]);

  const startTimer = () => {
    setPlaying(true);
  };

  const stopTimer = () => {
    setPlaying(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div>
        <button
          className={styles.button}
          onClick={!isPlaying ? startTimer : () => {}}
        >
          START
        </button>
      </div>
      <div className={styles.countdownContainer}>
        <p className={styles.textStyles}>{formatTime(countdown)}</p>
        <svg className={styles.svg}>
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="none"
            stroke={strokeBgColor}
            strokeWidth={strokeWidth}
          ></circle>
          <circle
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset()}
            r={radius}
            cx={radius}
            cy={radius}
            fill="none"
            strokeLinecap="round"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          ></circle>
        </svg>
      </div>
    </div>
  );
};

function Pomodoro() {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
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

  const calculateProgress = () => {
    const progress = ((25 * 60 - timeRemaining) / (25 * 60)) * 100;
    return progress > 100 ? 100 : progress;
  };

  return (
    <div className='pomodoroPage'>
      <section>
        <Section>
          <div className={styles.timerContainer}>
            <h1 className={styles.title}>Pomodoro</h1>
            <div className={styles.circularTimer}>
              <CountdownTimer
                seconds={timeRemaining}
                size={200}
                strokeBgColor="black"
                strokeColor="lightgreen"
                strokeWidth={12}
              />
              <div className={styles.timerText}>
                <span>{formatTime(timeRemaining)}</span>
                {isBreak ? <p>Break</p> : <p>Focus</p>}
              </div>
            </div>
            <div className={styles.timerControls}>
              <Button className={styles.timerButton} onClick={startTimer}>Start</Button>
              <Button className={styles.timerButton} onClick={stopTimer}>Stop</Button>
              <Button className={styles.timerButton} onClick={resetTimer}>Reset</Button>
            </div>
          </div>
          <ButtonGroup>
            <Button onClick={() => router.replace('/')}>Back to Home</Button>
          </ButtonGroup>
        </Section>
      </section>
    </div>
  );
}

export default Pomodoro;
