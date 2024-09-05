import React from "react";
import styled from "styled-components";

const StyledSummary = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  border-left: 1px solid #ccc;
  overflow-y: auto;
  margin-top: -7px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;

  .summary-section {
    flex: 1;
    padding: 15px;
    border-bottom: 1px solid grey;

    h3 {
      margin-bottom: 15px;
    }

    .summary-buttons {
      display: flex;
      justify-content: space-between;
    }
  }

  .server-section {
    flex: 1;
    padding: 15px;
  }

  .summary-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 5px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    // border-radius: 5px;
    cursor: pointer;
  }

  .summary-button:hover {
    background-color: #45a049;
  }
`;

const Summary = () => {
  return (
    <StyledSummary>
      <div className="summary-section">
        <h3>Topology Summary</h3>
        <div className="summary-buttons">
          <button className="summary-button">Node & Module</button>
          <button className="summary-button">Console</button>
        </div>
      </div>
      <div className="server-section">
        <h3>Server Summary</h3>
        <div> CPU 7.4%, RAM 80.6%</div>
        <div>server</div>
      </div>
    </StyledSummary>
  );
};

export default Summary;
