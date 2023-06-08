import React, { useState } from "react";
import Sidebar from "react-sidebar";
import "./Navbar.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open);
  };

  return (
    <Sidebar
      sidebar={
        <div className="nav-menu">
          <ul className="nav-menu-items">
            
            <li className="nav-text">
              <button className="btn btn-primary">Timer</button>
            </li>
            <li className="nav-text">
              <button className="btn btn-secondary">Settings</button>
            </li>
            <li className="nav-text">
              <button className="btn btn-success">Statistics</button>
            </li>
          </ul>
        </div>
      }
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
      
    </Sidebar>
  );
};

export default App;
