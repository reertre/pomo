<CircularProgressbar
  value={calculateProgress(isBreak ? breakTimeRemaining : focusTimeRemaining)}
  text={formatTime(isBreak ? breakTimeRemaining : focusTimeRemaining)}
  styles={buildStyles({
    rotation: 0.25,
    strokeLinecap: 'butt',
    textSize: '16px',
    pathTransitionDuration: 0.5,
    pathColor: `rgba(62, 152, 199, ${isBreak ? 1 : 0.5})`,
    textColor: '#f88',
    trailColor: '#d6d6d6',
    backgroundColor: '#3e98c7',
  })}
/>
