useEffect(() => {
  let intervalId;

  if (timerRunning && timeRemaining > 0) {
    intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);
  } else if (timerRunning && timeRemaining === 0) {
    if (!isBreak) {
      setShowModal(true);
      setIsBreak(true);
    } else {
      setTimeRemaining(25 * 60);
      setIsBreak(false);
    }
  }

  return () => {
    clearInterval(intervalId);
  };
}, [timerRunning, timeRemaining, isBreak]);
