import React, { useState, useRef } from "react";
import {
  Stage,
  Layer,
  Line,
  Circle,
  Text,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";
import TerminalModal from "./TerminalModal"; // Import the terminal modal

const Workspace = ({
  elements,
  setElements,
  connections,
  addConnection,
  deleteConnection,
  isEraseMode,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [startConnection, setStartConnection] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null); // State to store the selected device
  const stageRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const stage = stageRef.current.getStage();
    const pointerPosition = stage.getPointerPosition();
    const tool = JSON.parse(e.dataTransfer.getData("tool"));

    if (!tool || !pointerPosition) {
      console.error("Invalid drop data:", { tool, pointerPosition });
      return;
    }

    const name = prompt("Enter device name:");
    if (!name) {
      return;
    }

    setElements((prevElements) => [
      ...prevElements,
      {
        ...tool,
        x: pointerPosition.x,
        y: pointerPosition.y,
        id: prevElements.length,
        name: name,
      },
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleConnectionStart = (element, pointIndex) => {
    setStartConnection({ element, pointIndex });
    setIsConnecting(true);
  };

  const handleConnectionEnd = (element, pointIndex) => {
    if (isConnecting && startConnection) {
      const startElement = startConnection.element;
      const startPoint =
        getConnectionPoints(startElement)[startConnection.pointIndex];
      const endPoint = getConnectionPoints(element)[pointIndex];

      const points = [startPoint, { x: startPoint.x, y: endPoint.y }, endPoint];

      addConnection({
        start: startConnection,
        points: points,
        end: { element, pointIndex },
      });

      setStartConnection(null);
      setIsConnecting(false);
    }
  };

  const getConnectionPoints = (element) => [
    { x: element.x + 25, y: element.y },
    { x: element.x + 50, y: element.y + 25 },
    { x: element.x + 25, y: element.y + 50 },
    { x: element.x, y: element.y + 25 },
  ];

  const updateElementPosition = (id, newPosition) => {
    setElements((prevElements) =>
      prevElements.map((el) => (el.id === id ? { ...el, ...newPosition } : el))
    );
  };

  const handleLineClick = (index) => {
    if (isEraseMode) {
      deleteConnection(index);
    }
  };

  // Handle double-click event to open the terminal
  const handleDoubleClick = (element) => {
    setSelectedDevice(element);
  };

  const closeTerminal = () => {
    setSelectedDevice(null);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(240, 240, 240)",
        overflow: "auto",
        position: "relative",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
      >
        <Layer>
          {elements.map((element) => (
            <URLImage
              key={element.id}
              element={element}
              connectionPoints={getConnectionPoints(element)}
              onConnectionStart={(pointIndex) =>
                handleConnectionStart(element, pointIndex)
              }
              onConnectionEnd={(pointIndex) =>
                handleConnectionEnd(element, pointIndex)
              }
              onDoubleClick={() => handleDoubleClick(element)} // Handle double click
              onDragMove={(e) => {
                updateElementPosition(element.id, {
                  x: e.target.x(),
                  y: e.target.y(),
                });
              }}
            />
          ))}
          {connections.map((connection, index) => (
            <Line
              key={index}
              points={connection.points.flatMap(({ x, y }) => [x, y])}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
              onClick={() => handleLineClick(index)}
            />
          ))}
        </Layer>
      </Stage>

      {selectedDevice && (
        <TerminalModal device={selectedDevice} onClose={closeTerminal} />
      )}
    </div>
  );
};

const URLImage = ({
  element,
  connectionPoints,
  onConnectionStart,
  onConnectionEnd,
  onDragMove,
  onDoubleClick,
}) => {
  const [image] = useImage(element.src);

  return (
    <React.Fragment>
      <KonvaImage
        image={image}
        x={element.x}
        y={element.y}
        width={50}
        height={50}
        draggable
        onDragMove={onDragMove}
        onDblClick={onDoubleClick} // Add double-click event
      />
      {connectionPoints.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={5}
          fill="red"
          draggable={false}
          onMouseDown={() => onConnectionStart(index)}
          onMouseUp={() => onConnectionEnd(index)}
        />
      ))}
      <Text
        text={element.name || ""}
        x={element.x}
        y={element.y + 50}
        width={50}
        align="center"
        fontSize={12}
        fill="black"
      />
    </React.Fragment>
  );
};

export default Workspace;

