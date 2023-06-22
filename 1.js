const calculateProgress = () => {
  let totalDuration;

  if (timerMode === 'pomo') {
    totalDuration = 6 * 60; // Total duration for pomodoro in seconds
  } else if (timerMode === 'short') {
    totalDuration = 30; // Total duration for short break in seconds
  } else if (timerMode === 'long') {
    totalDuration = 60 * 60; // Total duration for long break in seconds
  } else {
    totalDuration = 0; // Default duration is 0
  }

  return (TimeRemaining / totalDuration) * 100;
};

const handleModeChange = (event) => {
  setTimerMode(event.target.id);

  switch (event.target.id) {
    case "pomo":
      setTimeRemaining(6 * 60); // 6 minutes
      break;
    case "short":
      setTimeRemaining(30); // 30 seconds
      break;
    case "long":
      setTimeRemaining(60 * 60); // 60 minutes
      break;
    default:
      setTimeRemaining(6 * 60); // Default to pomodoro mode
  }
};
