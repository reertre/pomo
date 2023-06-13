import React, { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { Section, Button, ButtonGroup, SectionItem, Grid, GridCol } from "@barclays/blueprint-react";
import styles from "../../pages/pomodoro/pomodoro.module.css";
import { FaPause, FaPlay } from 'react-icons/fa';
import { RxReset } from 'react-icons/rx';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Timer() {
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(5);
    setTimerRunning(false);
    setIsBreak(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    const progress = (timeRemaining / (25 * 60)) * 100;
    return progress > 0 ? progress : 0;
  };

  useEffect(() => {
    let intervalId;

    if (timerRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerRunning && timeRemaining === 0) {
      clearInterval(intervalId);

      if (!isBreak) {
        setShowModal(true);
        setIsBreak(true);
      } else {
        setTimeRemaining(60);
        setIsBreak(false);
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [timerRunning, timeRemaining, isBreak]);

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return (
        <div className={styles.timer}>
          <span>{formatTime(timeRemaining)}</span>
          {isBreak ? <h1>Break</h1> : <h1>Focus</h1>}
        </div>
      );
    }

    return <div className={styles.timerText}></div>;
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.pomodoroPage}>
      <Section className={styles.main}>
        <SectionItem>
          <div className={styles.pomodoroPage}>
            <h1 style={{ marginTop: "30px", padding: "10px", textSize: "60px" }}>Focus</h1>

            <div className={styles.timerWrapper}>
              <Grid>
                <Grid.Col>
                  <CircularProgressbar
                    value={calculateProgress()}
                    text={formatTime(timeRemaining)}
                    strokeWidth={8}
                    styles={{
                      path: {
                        stroke: "#2D27DC",
                      },
                    }}
                  />
                  {renderTime({ remainingTime: timeRemaining })}
                </Grid.Col>
              </Grid>
            </div>
          </div>
        </SectionItem>

        <SectionItem>
          <div className={styles.timerControls}>
            <Grid>
              <Grid.Col>
                <ButtonGroup>
                  <button onClick={startTimer} className={styles.start}><FaPlay className={styles.icons}></FaPlay></button>
                  <button onClick={stopTimer} className={styles.start}><FaPause className={styles.icons}></FaPause></button>
                  <button onClick={resetTimer} className={styles.start}><RxReset className={styles.icons}></RxReset></button>
                </ButtonGroup>
              </Grid.Col>
            </Grid>
          </div>
        </SectionItem>
      </Section>

      <Modal
        open={showModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Take a break!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            It's time for a break. Relax and recharge.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Timer;
