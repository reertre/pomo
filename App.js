import React, { useState } from 'react';
import Pomodoro from './Pomodoro';
import Settings from './Settings';

const App = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(10);
  const [longBreakDuration, setLongBreakDuration] = useState(20);

  return (
    <div>
      <Settings
        workDuration={workDuration}
        setWorkDuration={setWorkDuration}
        shortBreakDuration={shortBreakDuration}
        setShortBreakDuration={setShortBreakDuration}
        longBreakDuration={longBreakDuration}
        setLongBreakDuration={setLongBreakDuration}
      />
      <Pomodoro
        workDuration={workDuration}
        shortBreakDuration={shortBreakDuration}
        longBreakDuration={longBreakDuration}
      />
    </div>
  );
};

export default App;
