import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 400,
    margin: 'auto',
  },
});

const Settings = () => {
  const classes = useStyles();

  const handleWorkDurationChange = (event, value) => {
    console.log('Work Duration:', value);
  };

  const handleShortBreakDurationChange = (event, value) => {
    console.log('Short Break Duration:', value);
  };

  const handleLongBreakDurationChange = (event, value) => {
    console.log('Long Break Duration:', value);
  };

  const handleRoundsChange = (event, value) => {
    console.log('Rounds:', value);
  };

  return (
    <div className={classes.root}>
      <div>
        <p>Work Duration</p>
        <Slider
          min={5}
          max={60}
          marks={[
            { value: 5, label: '5 mins' },
            { value: 60, label: '60 mins' },
          ]}
          onChange={handleWorkDurationChange}
          defaultValue={25}
          valueLabelDisplay="auto"
        />
      </div>

      <div>
        <p>Short Break Duration</p>
        <Slider
          min={1}
          max={30}
          marks={[
            { value: 1, label: '1 min' },
            { value: 30, label: '30 mins' },
          ]}
          onChange={handleShortBreakDurationChange}
          defaultValue={10}
          valueLabelDisplay="auto"
        />
      </div>

      <div>
        <p>Long Break Duration</p>
        <Slider
          min={1}
          max={45}
          marks={[
            { value: 1, label: '1 min' },
            { value: 45, label: '45 mins' },
          ]}
          onChange={handleLongBreakDurationChange}
          defaultValue={20}
          valueLabelDisplay="auto"
        />
      </div>

      <div>
        <p>Rounds</p>
        <Slider
          min={2}
          max={15}
          marks={[
            { value: 2, label: '2' },
            { value: 15, label: '15' },
          ]}
          onChange={handleRoundsChange}
          defaultValue={5}
          valueLabelDisplay="auto"
        />
      </div>
    </div>
  );
};

export default Settings;
