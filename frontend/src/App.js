import React, { useState } from "react";
import "./App.css";

function App() {
  const [commands, setCommands] = useState([{ ip: "", command: "" }]);
  const [output, setOutput] = useState("");

  const handleInputChange = (index, field, value) => {
    const newCommands = [...commands];
    newCommands[index][field] = value;
    setCommands(newCommands);
  };

  const addCommand = () => {
    setCommands([...commands, { ip: "", command: "" }]);
  };

  const handleExecute = async () => {
    try {
      const response = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commands }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      setOutput(data);
    } catch (error) {
      console.error("Error:", error);
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Raspberry Pi Command Executor</h1>
      {commands.map((cmd, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="IP Address"
            value={cmd.ip}
            onChange={(e) => handleInputChange(index, "ip", e.target.value)}
          />
          <input
            type="text"
            placeholder="Command"
            value={cmd.command}
            onChange={(e) =>
              handleInputChange(index, "command", e.target.value)
            }
          />
        </div>
      ))}
      <button onClick={addCommand}>Add Command</button>
      <button onClick={handleExecute}>Execute</button>

      <div className="output-container">
        <h2>Command Output</h2>
        <pre className="output">{output}</pre>
      </div>
    </div>
  );
}

export default App;
