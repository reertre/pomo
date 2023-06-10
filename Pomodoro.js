import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CardComponent = ({ title, content }) => (
  <Card
    sx={{
      minWidth: 275,
      width: '100%',
      margin: '10px',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
        cursor: 'pointer',
      },
    }}
  >
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5" component="div">
        {content}
      </Typography>
    </CardContent>
  </Card>
);

const BasicCard = () => {
  return (
    <Box display="flex" justifyContent="center">
      <CardComponent title="0 36m card today" content="0 36m" />
      <CardComponent title="0 36m card week" content="0 36m" />
      <CardComponent title="4h23m" content="card" />
      <CardComponent title="4h23m total" content="card" />
    </Box>
  );
};

export default BasicCard;
