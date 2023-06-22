import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const CustomSlider = withStyles({
  root: {
    color: '#2D27DC', // Change to the desired color
    height: 6,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#2D27DC', // Change to the desired color
    border: '2px solid currentColor',
    marginTop: -9,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  track: {
    height: 6,
  },
  rail: {
    height: 6,
  },
})(Slider);

const marks = [
  {
    value: 5,
    label: '5 mins',
  },
  {
    value: 60,
    label: '60 mins',
  },
];

const Settings = ({ timerMode, setTimerMode, setTimeRemaining }) => {
  const handleDurationChange = (event, value) => {
    if (timerMode === 'pomo') {
      setTimeRemaining(value * 60);
    } else if (timerMode === 'short') {
      setTimeRemaining(value);
    } else if (timerMode === 'long') {
      setTimeRemaining(value * 60);
    }
  };

  return (
    <div>
      <div>
        <p>Work Duration</p>
        <CustomSlider
          valueLabelDisplay="auto"
          min={5}
          max={60}
          step={5}
          marks={marks}
          value={timerMode === 'pomo' ? (timeRemaining / 60) : 0}
          onChange={handleDurationChange}
        />
      </div>

      <div>
        <p>Short Break Duration</p>
        <CustomSlider
          valueLabelDisplay="auto"
          min={1}
          max={30}
          step={1}
          marks={marks}
          value={timerMode === 'short' ? timeRemaining : 0}
          onChange={handleDurationChange}
        />
      </div>

      <div>
        <p>Long Break Duration</p>
        <CustomSlider
          valueLabelDisplay="auto"
          min={1}
          max={45}
          step={1}
          marks={marks}
          value={timerMode === 'long' ? (timeRemaining / 60) : 0}
          onChange={handleDurationChange}
        />
      </div>

      <div>
        <p>Rounds</p>
        <CustomSlider
          valueLabelDisplay="auto"
          min={2}
          max={15}
          step={1}
          marks={marks}
          value={0}
          onChange={handleDurationChange}
        />
      </div>
    </div>
  );
};

export default Settings;
