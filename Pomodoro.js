import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './SliderComponent.module.css'; // Import the CSS module

const SliderComponent = () => {
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        <div className={styles.sliderTitle}>Work Duration</div>
        <Slider min={5} max={60} />
      </div>
      <div className={styles.slider}>
        <div className={styles.sliderTitle}>Short Break Duration</div>
        <Slider min={1} max={30} />
      </div>
      <div className={styles.slider}>
        <div className={styles.sliderTitle}>Long Break Duration</div>
        <Slider min={1} max={45} />
      </div>
      <div className={styles.slider}>
        <div className={styles.sliderTitle}>Rounds</div>
        <Slider min={2} max={15} />
      </div>
    </div>
  );
};

export default SliderComponent;
