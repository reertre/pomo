import React, { useState } from "react";
import Sidebar from "react-sidebar";
import "./Navbar.css";

const SidebarContent = ({ setPage }) => {
  return (
    <div className={styles.navMenu}>
      <ul className={styles.navMenuItems}>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setPage("timer")}>
            Timer
          </button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setPage("settings")}>
            Settings
          </button>
        </li>
        <li className={styles.navText}>
          <button className={`${styles.btn} ${styles.btnSuccess}`}>Statistics</button>
        </li>
      </ul>
    </div>
  );
};

const TimerPage = () => {
  return (
    <div>
      <h1>Pomodoro</h1>
      {/* Timer and circular progress bar content */}
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div>
      <h1>Settings</h1>
      {/* Only the settings content */}
    </div>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("timer");

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  const renderPage = () => {
    if (activePage === "timer") {
      return <TimerPage />;
    } else if (activePage === "settings") {
      return <SettingsPage />;
    }
    // Add more conditions for other pages
  };

  return (
    <Sidebar
      sidebar={<SidebarContent setPage={setActivePage} />}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      docked={true}
      styles={{
        sidebar: {
          background: "#fffff",
          width: "250px",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: sidebarOpen ? "0" : "-100%",
          transition: "350ms",
        },
        content: {
          marginLeft: "250px",
        },
      }}
    >
      <div className={styles.pomodoroPage}>
        {activePage === "timer" && (
          <Section>
            <section>
              <section>
                <div>
                  <h1>Pomodoro</h1>
                  <div className={styles.timerWrapper}>
                    <CircularProgressbar
                      value={calculateProgress()}
                      text={formatTime(timeRemaining)}
                      strokeWidth={10}
                    />

                    {renderTime({ remainingTime: timeRemaining })}
                  </div>
                </div>
              </section>
            </section>

            <section>
              <div className={styles.timerControls}>
                <ButtonGroup>
                  <Button onClick={startTimer}>Start</Button>
                  <Button onClick={stopTimer}>Stop</Button>
                  <Button onClick={resetTimer}>Reset</Button>
                </ButtonGroup>
              </div>
            </section>
          </Section>
        )}

        {activePage === "settings" && (
          <Section>
            <SettingsPage />
          </Section>
        )}
      </div>
    </Sidebar>
  );
};

export default App;
