import React, { useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./App.css";

const minuteSeconds = 60;

const timerProps = {
  isPlaying: true,
  size: 400,
  strokeWidth: 30
};

const renderTime = (time) => {
  const minutes = Math.floor(time / minuteSeconds);
  const seconds = Math.floor(time % minuteSeconds);
  return (
    <div className="time-wrapper">
      <div className="time">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default function App() {
  const [initialTime, setInitialTime] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(initialTime * minuteSeconds);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemainingTime(initialTime * minuteSeconds);
  };

  const handleTimeChange = (event) => {
    const newTime = parseInt(event.target.value);
    setInitialTime(newTime);
    setRemainingTime(newTime * minuteSeconds);
  };

  return (
    <div className="App">
      <div className="timer-container">
        <div className="timer-wrapper">
          <CountdownCircleTimer
            {...timerProps}
            colors="#0344f9"
            duration={remainingTime}
            initialRemainingTime={remainingTime}
            isPlaying={isRunning}
            onComplete={() => [false, 0]}
          >
            {({ elapsedTime }) => renderTime(remainingTime - elapsedTime)}
          </CountdownCircleTimer>
        </div>

        <div className="buttons">
          <button onClick={startTimer}>Start</button>
          <button onClick={stopTimer}>Stop</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>

      <div className="settings">
        <button onClick={() => alert("Open settings modal")}>Settings</button>
      </div>
    </div>
  );
}
