import React, { useState, useEffect } from 'react';
import styles from './pomodoro.module.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Controls from './controls';
import CardContent from './cardsContent';
import Settings from './settings';

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(60); // Initial duration in seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState('pomo');

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(60); // Reset to initial duration
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleModeChange = (event) => {
    setTimerMode(event.target.id);
    switch (event.target.id) {
      case 'pomo':
        setTimeRemaining(60); // Set to initial duration for pomodoro mode
        break;
      case 'short':
        setTimeRemaining(30); // Set to desired duration for short break
        break;
      case 'long':
        setTimeRemaining(90); // Set to desired duration for long break
        break;
      default:
        setTimeRemaining(60); // Default to pomodoro mode
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

  useEffect(() => {
    // Update the timer when the duration values change
    if (timerMode === 'pomo') {
      setTimeRemaining(60); // Set to initial duration for pomodoro mode
    } else if (timerMode === 'short') {
      setTimeRemaining(30); // Set to desired duration for short break
    } else if (timerMode === 'long') {
      setTimeRemaining(90); // Set to desired duration for long break
    }
  }, [timerMode]);

  const calculateProgress = () => {
    return (timeRemaining / (timerMode === 'long' ? 90 : 60)) * 100;
  };

  const renderTime = ({ remainingTime }) => {
    return <div className={styles.timerText}>{formatTime(remainingTime)}</div>;
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
                duration={timeRemaining}
                colors={[['#2D27DC']]}
                strokeWidth={6}
                size={300}
                onComplete={() => setIsBreak((prevIsBreak) => !prevIsBreak)}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className={styles.controls}>
              <button onClick={startTimer}>Start</button>
              <button onClick={stopTimer}>Stop</button>
              <button onClick={resetTimer}>Reset</button>
            </div>
          </div>
          {!isBreak && timeRemaining === 0 && <CardContent />}
        </section>
        <Settings
          timerMode={timerMode}
          setTimerMode={setTimerMode}
          setTimeRemaining={setTimeRemaining}
        />
      </section>
    </div>
  );
};

export default Pomodoro;
