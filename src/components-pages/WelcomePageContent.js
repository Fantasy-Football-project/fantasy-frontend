//The content for the Welcome Page.
import React from "react";
import { Link } from "react-router-dom";

function WelcomePageContent() {
  const pageStyle = {
    backgroundColor: "#d4edda", // light green background
    minHeight: "100vh",
    paddingTop: "20px",
    paddingBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const containerStyle = {
    backgroundColor: "#d4edda", // same as page background for no color blocks
    borderRadius: "10px",
    padding: "20px 40px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  const headingStyle = {
    color: "#155724", // dark green text
    marginBottom: "10px",
  };

  const buttonStyle = {
    marginTop: "15px",
    backgroundColor: "#28a745",
    borderColor: "#28a745",
    padding: "10px 25px",
  };

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Fantasy Football Registration</h1>
      <div style={containerStyle}>
        <h1 className="display-4" style={headingStyle}>Welcome</h1>
        <h2 className="lead" style={headingStyle}>Login to play</h2>
        <Link to="/login" className="btn" style={buttonStyle}>Login</Link>
      </div>
    </div>
  );
}

export default WelcomePageContent;