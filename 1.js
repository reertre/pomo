import React from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styles from "./styles.module.css";

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className={styles.timer}>Too late...</div>;
  }

  return (
    <div className={styles.timer}>
      <div className={styles.text}>Remaining</div>
      <div className={styles.value}>{remainingTime}</div>
      <div className={styles.text}>seconds</div>
    </div>
  );
};

function App() {
  return (
    <div className={styles.App}>
      <h1>
        CountdownCircleTimer
        <br />
        React Component
      </h1>
      <div className={styles.timerWrapper}>
        <CountdownCircleTimer
          isPlaying
          duration={7}
          colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
          onComplete={() => [true, 1000]}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <p className={styles.info}>
        Change component properties in the code field on the right to try
        different functionalities.
      </p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
