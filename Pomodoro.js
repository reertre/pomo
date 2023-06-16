import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Carousel } from "react-material-ui-carousel";

const Pomodoro = () => {
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(25 * 60);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setFocusTimeRemaining(25 * 60);
    setBreakTimeRemaining(5 * 60);
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = (timeRemaining) => {
    const totalTime = isBreak ? 5 * 60 : 25 * 60;
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    return progress > 100 ? 100 : progress;
  };

  useEffect(() => {
    let intervalId;

    if (timerRunning && focusTimeRemaining > 0) {
      intervalId = setInterval(() => {
        setFocusTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerRunning && focusTimeRemaining === 0) {
      clearInterval(intervalId);

      if (!isBreak) {
        setBreakTimeRemaining(5 * 60);
        setIsBreak(true);
      } else {
        setFocusTimeRemaining(25 * 60);
        setIsBreak(false);
      }
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, focusTimeRemaining, isBreak]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className={styles.timer}>Too late...</div>;
    }

    return (
      <div className={styles.timerText}>
        <span>{formatTime(isBreak ? breakTimeRemaining : focusTimeRemaining)}</span>
        {isBreak ? <p>Break</p> : <p>Pomodoro</p>}
      </div>
    );
  };

  const carouselItems = [
    {
      id: 1,
      content: <div className={styles.card}>Card 1</div>,
    },
    {
      id: 2,
      content: <div className={styles.card}>Card 2</div>,
    },
    {
      id: 3,
      content: <div className={styles.card}>Card 3</div>,
    },
  ];

  const renderCardsSection = () => {
    if (!timerRunning && focusTimeRemaining === 0 && isBreak) {
      return (
        <section>
          <div className={styles.cardsSection}>
            <h2>Cards Section</h2>
            <Carousel>
              {carouselItems.map((item) => (
                <div key={item.id}>{item.content}</div>
              ))}
            </Carousel>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <section>
          <div className={styles.Pomodoro}>
            <h1 styles={{ marginTop: "20px", padding: "20px" }}>Pomodoro</h1>
            <div className={styles.timerwrapper}>
              <CountdownCircleTimer
                isPlaying={timerRunning}
                duration={isBreak ? breakTimeRemaining : focusTimeRemaining}
                colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                onComplete={() => {
                  setTimerRunning(false);
                }}
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
      {renderCardsSection()}
    </div>
  );
};

export default Pomodoro;
