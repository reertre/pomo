import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Section, Button, ButtonGroup, Typography, Pagination } from '@barclays/blueprint-react';
import styles from "./pomodoro.module.css";
import Sidebar from "react-sidebar";
import "./Navbar.css";

const SidebarContent = () => {
  return (
    <div className={styles.navMenu}>
      <ul className={styles.navMenuItems}>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>Timer</button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>Settings</button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSuccess}`}>Statistics</button>
        </li>
      </ul>
    </div>
  );
};

const Slideshow = () => {
  const [activeCard, setActiveCard] = useState(0);
  const cards = [
    { title: "Focus", content: "Focus on your task" },
    { title: "Short Break", content: "Take a short break" },
    { title: "Long Break", content: "Take a long break" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prevActiveCard) => (prevActiveCard + 1) % cards.length);
    }, 3000); // Change card every 3 seconds

    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div>
      {cards.map((card, index) => (
        <div key={index} style={{ display: index === activeCard ? "block" : "none" }}>
          <h1>{card.title}</h1>
          <section>
            <p>{card.content}</p>
          </section>
        </div>
      ))}
    </div>
  );
};

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [page, setPage] = useState(1);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(45);
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const progress = ((45 - timeRemaining) / 45) * 100;
    return progress > 100 ? 100 : progress;
  };

  const handleChange = (event, value) => {
    setPage(value);
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
        setTimeRemaining(300); // Set 5 minutes for short break
        setIsBreak(true);
        setPage(2); // Update page to short break
      } else {
        setTimeRemaining(900); // Set 15 minutes for long break
        setIsBreak(false);
        setPage(3); // Update page to long break
      }
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, timeRemaining, isBreak]);

  return (
    <Sidebar
      sidebar={<SidebarContent />}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      docked={true}
      styles={{
        sidebar: {
          background: "#fffff",
          width: "250px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: sidebarOpen ? "0" : "-100%",
          transition: "350ms",
        },
        content: {
          marginLeft: "250px",
        },
      }}
    >
      <div className={styles.pomodoroPage}>
        <Section>
          <Slideshow />
          <div className={styles.timerWrapper}>
            <CircularProgressbar
              value={calculateProgress()}
              text={formatTime(timeRemaining)}
              strokeWidth={10}
            />
          </div>
        </Section>

        <Section>
          <div className={styles.timerControls}>
            <ButtonGroup>
              <Button onClick={startTimer}>Start</Button>
              <Button onClick={stopTimer}>Stop</Button>
              <Button onClick={resetTimer}>Reset</Button>
            </ButtonGroup>
          </div>
        </Section>

        <Typography>Page: {page}</Typography>
        <Pagination count={3} page={page} onChange={handleChange} />
      </div>
    </Sidebar>
  );
};

export default Pomodoro;
