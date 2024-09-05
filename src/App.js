import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import Workspace from "./components/Workspace";
import Summary from "./components/Summary";

function App() {
  const [elements, setElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [isEraseMode, setIsEraseMode] = useState(false);

  const addElement = (element) => {
    setElements((prevElements) => [...prevElements, element]);
  };

  const addConnection = (connection) => {
    setConnections((prevConnections) => [...prevConnections, connection]);
  };

  const deleteConnection = (index) => {
    setConnections((prevConnections) => {
      const updatedConnections = prevConnections.filter((_, i) => i !== index);

      // Get the elements that have connections
      const elementsWithConnections = updatedConnections.flatMap(
        (connection) => [connection.start.element.id, connection.end.element.id]
      );
      const uniqueElementsWithConnections = [
        ...new Set(elementsWithConnections),
      ];

      // Filter out elements that have no connections
      const updatedElements = elements.filter((element) =>
        uniqueElementsWithConnections.includes(element.id)
      );

      setElements(updatedElements);

      return updatedConnections;
    });
  };

  const toggleEraseMode = () => {
    setIsEraseMode((prevMode) => !prevMode);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "#e0e0e0",
          borderBottom: "1px solid #ccc",
          fontSize: "14px",
          color: "#333",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "20px",
          zIndex: "10",
          textAlign: "left",
        }}
      >
        Security Lab
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "calc(100vh - 40px)",
          marginTop: "40px",
        }}
      >
        <Toolbar
          onDropElement={addElement}
          toggleEraseMode={toggleEraseMode}
          isEraseMode={isEraseMode}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "auto",
          }}
        >
          <Workspace
            elements={elements}
            connections={connections}
            addConnection={addConnection}
            deleteConnection={deleteConnection}
            isEraseMode={isEraseMode}
            setElements={setElements} // Pass setElements here
          />
        </div>
        <Summary />
      </div>
    </div>
  );
}

export default App;
