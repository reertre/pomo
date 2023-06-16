import React, { useState, useEffect } from "react";
import styles from "./pomodoro.module.css";

const Pomodoro = () => {
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(25 * 60);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showCard, setShowCard] = useState(1);

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
    setShowCards(false);
    setShowCard(1);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
        setShowCards(true);
      } else {
        setFocusTimeRemaining(25 * 60);
        setIsBreak(false);
        setShowCards(false);
        setShowCard(1);
      }
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, focusTimeRemaining, isBreak]);

  useEffect(() => {
    if (showCards) {
      const timer = setTimeout(() => {
        setShowCard((prevCard) => (prevCard === 3 ? 1 : prevCard + 1));
      }, 3000); // Change to the desired duration in milliseconds

      return () => clearTimeout(timer);
    }
  }, [showCards]);

  const renderCardsSection = () => {
    if (!timerRunning && focusTimeRemaining === 0 && isBreak && showCards) {
      const cards = [
        { id: 1, content: 'Content 1' },
        { id: 2, content: 'Content 2' },
        { id: 3, content: 'Content 3' }
      ];

      return (
        <section>
          <div className={styles.cardsSection}>
            <h2>Cards Section</h2>
            <div className={styles.cardContainer}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`${styles.card} ${showCard === card.id ? styles.show : ""}`}
                >
                  <div className={styles.cardContent}>
                    <h3>Card {card.id}</h3>
                    <p>{card.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  return (
    <div className={styles.pomodoroPage}>
      <section>
        <div className={styles.Pomodoro}>
          <h1 styles={{ marginTop: "20px", padding: "20px" }}>Pomodoro</h1>
        </div>
      </section>
      {renderCardsSection()}
    </div>
  );
};

export default Pomodoro;
