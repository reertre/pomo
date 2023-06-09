import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Settings = () => {
  const style = { width: 400, margin: 'auto' };
  const marks = {
    5: '5 mins',
    60: '60 mins',
  };

  const handleWorkDurationChange = (value) => {
    console.log('Work Duration:', value);
  };

  const handleShortBreakDurationChange = (value) => {
    console.log('Short Break Duration:', value);
  };

  const handleLongBreakDurationChange = (value) => {
    console.log('Long Break Duration:', value);
  };

  const handleRoundsChange = (value) => {
    console.log('Rounds:', value);
  };

  const railStyle = {
    backgroundColor: '#2D27DC', // Change to the desired color
    height: '6px',
    borderRadius: '3px',
  };

  return (
    <div style={style}>
      <div>
        <p>Work Duration</p>
        <Slider
          min={5}
          max={60}
          marks={marks}
          onChange={handleWorkDurationChange}
          defaultValue={25}
          railStyle={railStyle}
        />
      </div>

      <div>
        <p>Short Break Duration</p>
        <Slider
          min={1}
          max={30}
          marks={marks}
          onChange={handleShortBreakDurationChange}
          defaultValue={10}
          railStyle={railStyle}
        />
      </div>

      <div>
        <p>Long Break Duration</p>
        <Slider
          min={1}
          max={45}
          marks={marks}
          onChange={handleLongBreakDurationChange}
          defaultValue={20}
          railStyle={railStyle}
        />
      </div>

      <div>
        <p>Rounds</p>
        <Slider
          min={2}
          max={15}
          marks={marks}
          onChange={handleRoundsChange}
          defaultValue={5}
          railStyle={railStyle}
        />
      </div>
    </div>
  );
};

export default Settings;
