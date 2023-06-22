import React, { useState, useEffect } from 'react';
import styles from './pomodoro.module.css';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import Controls from './controls';
import CardContent from './cardsContent';

const Pomodoro = ({ workDuration, shortBreakDuration, longBreakDuration }) => {
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60); // Convert minutes to seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timerMode, setTimerMode] = useState('pomo');

  // Rest of the code...

  const handleModeChange = (event) => {
    setTimerMode(event.target.id);
    switch (event.target.id) {
      case 'pomo':
        setTimeRemaining(workDuration * 60);
        break;
      case 'short':
        setTimeRemaining(shortBreakDuration * 60);
        break;
      case 'long':
        setTimeRemaining(longBreakDuration * 60);
        break;
      default:
        setTimeRemaining(workDuration * 60);
    }
  };

  // Rest of the code...
};
