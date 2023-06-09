import React, { useState } from 'react';

const CenteredSliders = () => {
  const [workDuration, setWorkDuration] = useState(5);
  const [shortBreakDuration, setShortBreakDuration] = useState(1);
  const [longBreakDuration, setLongBreakDuration] = useState(1);
  const [rounds, setRounds] = useState(2);

  const handleWorkDurationChange = (event) => {
    setWorkDuration(parseInt(event.target.value));
  };

  const handleShortBreakDurationChange = (event) => {
    setShortBreakDuration(parseInt(event.target.value));
  };

  const handleLongBreakDurationChange = (event) => {
    setLongBreakDuration(parseInt(event.target.value));
  };

  const handleRoundsChange = (event) => {
    setRounds(parseInt(event.target.value));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Work Duration: {workDuration} mins</h2>
      <input
        type="range"
        min="5"
        max="60"
        value={workDuration}
        onChange={handleWorkDurationChange}
      />

      <h2>Short Break Duration: {shortBreakDuration} mins</h2>
      <input
        type="range"
        min="1"
        max="30"
        value={shortBreakDuration}
        onChange={handleShortBreakDurationChange}
      />

      <h2>Long Break Duration: {longBreakDuration} mins</h2>
      <input
        type="range"
        min="1"
        max="45"
        value={longBreakDuration}
        onChange={handleLongBreakDurationChange}
      />

      <h2>Rounds: {rounds}</h2>
      <input
        type="range"
        min="2"
        max="15"
        value={rounds}
        onChange={handleRoundsChange}
      />
    </div>
  );
};

export default CenteredSliders;
