import React from "react";
import styled from "styled-components";

const ModalBackdrop = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 200px; /* Adjust height to allow images to appear properly */
  background-color: rgba(0, 0, 0, 0.5); /* Slightly transparent backdrop */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: relative;
  background-color: #333; /* Change to a grey color for the terminal */
  color: white;
  padding: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

// Styled close icon (using Unicode character for simplicity)
const CloseIcon = styled.span`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const TerminalModal = ({ device, onClose }) => {
  return (
    <ModalBackdrop>
      <ModalContainer>
        <CloseIcon onClick={onClose}>&times;</CloseIcon> {/* Close button */}
        <h2>Terminal for {device.name}</h2>
        <textarea
          rows="8"
          style={{
            width: "100%",
            height: "100px",
            backgroundColor: "#444", /* Darker grey for the textarea */
            color: "white",
            border: "none",
          }}
          defaultValue={`>`}
        />
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default TerminalModal;



