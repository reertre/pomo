import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Section, Button, ButtonGroup } from '@barclays/blueprint-react';
import styles from "./pomodoro.module.css";
import Link from "next/Link";
import Sidebar from "react-sidebar";
import "./Navbar.css";

const SidebarContent = ({ setPage }) => {
  return (
    <div className={styles.navMenu}>
      <ul className={styles.navMenuItems}>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setPage("focus")}>
            Focus
          </button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setPage("shortBreak")}>
            Short Break
          </button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={() => setPage("longBreak")}>
            Long Break
          </button>
        </li>
      </ul>
    </div>
  );
};

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("focus");

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

  useEffect(() => {
    let intervalId;

    if (timerRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerRunning && timeRemaining === 0) {
      clearInterval(intervalId);

      if (activePage === "focus") {
        setTimeRemaining(5 * 60);
        setActivePage("shortBreak");
      } else if (activePage === "shortBreak") {
        setTimeRemaining(15 * 60);
        setActivePage("longBreak");
      } else if (activePage === "longBreak") {
        setTimeRemaining(25 * 60);
        setActivePage("focus");
      }

      setIsBreak(true);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning, timeRemaining, activePage]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className={styles.timer}>Too late...</div>;
    }

    return (
      <div className={styles.timerText}></div>
    );
  };

  const setPage = (page) => {
    if (page !== activePage) {
      setActivePage(page);
      setIsBreak(false);
      resetTimer();
    }
  };

  return (
    <Sidebar
      sidebar={<SidebarContent setPage={setPage} />}
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
          <section>
            <section>
              <div>
                <h1>Pomodoro</h1>
                <div className={styles.timerWrapper}>
                  <CircularProgressbar
                    value={calculateProgress()}
                    text={formatTime(timeRemaining)}
                    strokeWidth={10}
                  />

                  {renderTime({ remainingTime: timeRemaining })}
                </div>
              </div>
            </section>
          </section>

          <section>
            <div className={styles.timerControls}>
              <ButtonGroup>
                <Button onClick={startTimer}>Start</Button>
                <Button onClick={stopTimer}>Stop</Button>
                <Button onClick={resetTimer}>Reset</Button>
              </ButtonGroup>
            </div>
          </section>
        </Section>
      </div>
    </Sidebar>
  );
};

export default Pomodoro;
