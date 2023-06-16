import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const Pomodoro = () => {
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(25 * 60);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showCards, setShowCards] = useState(false); // New state variable to track if cards are shown

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

  const renderCardsSection = () => {
    if (!timerRunning && focusTimeRemaining === 0 && isBreak && showCards) {
      return (
        <Section>
          <div className={styles.cardsSection}>
            {/* Add your cards component or JSX here */}
            <h2>Cards Section</h2>
            {/* Example card */}
            <div className={styles.card}>Card 1</div>
            <div className={styles.card}>Card 2</div>
            <div className={styles.card}>Card 3</div>
          </div>
        </Section>
      );
    }
    return null;
  };

  useEffect(() => {
    if (showCards) {
      // Set the timer duration to 45 seconds when the cards are shown
      setFocusTimeRemaining(45);
      setIsBreak(false);
    }
  }, [showCards]);

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <Section>
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
            <ButtonGroup>
              <button onClick={startTimer}>Start</button>
              <button onClick={stopTimer}>Stop</button>
              <button onClick={resetTimer}>Reset</button>
              <button onClick={() => setShowCards(true)}>Show Cards</button> {/* Button to show the cards */}
            </ButtonGroup>
          </div>
        </Section>
      </section>
      {renderCardsSection()}
    </div>
  );
};

export default Pomodoro;
