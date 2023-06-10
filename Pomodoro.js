import React from 'react';
import { Box, Slider, Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import './SliderSettings.css';

const SliderSettings = () => {
  const marks = [
    { value: 5, label: '5 mins' },
    { value: 60, label: '60 mins' },
  ];

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

  const handleNotificationSoundChange = (event) => {
    console.log('Notification Sound:', event.target.value);
  };

  const handleWeekStartsOnChange = (event) => {
    console.log('Week Starts On:', event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div className="slider-container">
        <Typography variant="h6">Work Duration</Typography>
        <Slider
          min={5}
          max={60}
          step={1}
          marks={marks}
          onChange={handleWorkDurationChange}
          defaultValue={25}
        />
      </div>

      <div className="slider-container">
        <Typography variant="h6">Short Break Duration</Typography>
        <Slider
          min={1}
          max={30}
          step={1}
          marks={marks}
          onChange={handleShortBreakDurationChange}
          defaultValue={10}
        />
      </div>

      <div className="slider-container">
        <Typography variant="h6">Long Break Duration</Typography>
        <Slider
          min={1}
          max={45}
          step={1}
          marks={marks}
          onChange={handleLongBreakDurationChange}
          defaultValue={20}
        />
      </div>

      <div className="slider-container">
        <Typography variant="h6">Rounds</Typography>
        <Slider
          min={2}
          max={15}
          step={1}
          marks={marks}
          onChange={handleRoundsChange}
          defaultValue={5}
        />
      </div>

      <div className="dropdown-container">
        <FormControl fullWidth>
          <InputLabel id="notification-sound-label">Notification Sound</InputLabel>
          <Select
            labelId="notification-sound-label"
            id="notification-sound-select"
            onChange={handleNotificationSoundChange}
          >
            <MenuItem value="sound1">Sound 1</MenuItem>
            <MenuItem value="sound2">Sound 2</MenuItem>
            <MenuItem value="sound3">Sound 3</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="dropdown-container">
        <FormControl fullWidth>
          <InputLabel id="week-starts-label">Week Starts On</InputLabel>
          <Select
            labelId="week-starts-label"
            id="week-starts-select"
            onChange={handleWeekStartsOnChange}
          >
            <MenuItem value="sunday">Sunday</MenuItem>
            <MenuItem value="monday">Monday</MenuItem>
            <MenuItem value="tuesday">Tuesday</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Box>
  );
};

export default SliderSettings;
