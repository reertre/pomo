import React from 'react'
import useSound from 'use-sound'
import clickSfx from '../../sounds/slide.mp3'

const Controls = ({ timerMode, setTimerMode }) => {
  const [playSfx] = useSound(clickSfx, { volume: volume });

  const handleModeChange = (event) => {
    setTimerMode(event.target.id);
  }

  return (
    <form className="controls">
      <input
        type="radio"
        id="pomo"
        name="mode"
        checked={timerMode === 'pomo'}
        onClick={playSfx}
        onChange={handleModeChange}
      />
      <label htmlFor="pomo" className="controls__button">pomodoro</label>

      <input
        type="radio"
        id="short"
        name="mode"
        checked={timerMode === 'short'}
        onClick={playSfx}
        onChange={handleModeChange}
      />
      <label htmlFor="short" className="controls__button">short break</label>

      <input
        type="radio"
        id="long"
        name="mode"
        checked={timerMode === 'long'}
        onClick={playSfx}
        onChange={handleModeChange}
      />
      <label htmlFor="long" className="controls__button">long break</label>
    </form>
  )
}

export default Controls;
