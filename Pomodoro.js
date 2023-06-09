import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
npm install @mui/material @emotion/react @emotion/styled


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

  const sliderStyles = {
    color: '#2D27DC',
    '& .MuiSlider-rail': {
      backgroundColor: '#2D27DC',
    },
    '& .MuiSlider-track': {
      backgroundColor: '#2D27DC',
    },
    '& .MuiSlider-thumb': {
      backgroundColor: '#2D27DC',
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div>
        <Typography variant="h6">Work Duration</Typography>
        <Slider
          min={5}
          max={60}
          step={1}
          marks={marks}
          onChange={handleWorkDurationChange}
          defaultValue={25}
          sx={sliderStyles}
        />
      </div>

      <div>
        <Typography variant="h6">Short Break Duration</Typography>
        <Slider
          min={1}
          max={30}
          step={1}
          marks={marks}
          onChange={handleShortBreakDurationChange}
          defaultValue={10}
          sx={sliderStyles}
        />
      </div>

      <div>
        <Typography variant="h6">Long Break Duration</Typography>
        <Slider
          min={1}
          max={45}
          step={1}
          marks={marks}
          onChange={handleLongBreakDurationChange}
          defaultValue={20}
          sx={sliderStyles}
        />
      </div>

      <div>
        <Typography variant="h6">Rounds</Typography>
        <Slider
          min={2}
          max={15}
          step={1}
          marks={marks}
          onChange={handleRoundsChange}
          defaultValue={5}
          sx={sliderStyles}
        />
      </div>
    </Box>
  );
};

export default SliderSettings;
