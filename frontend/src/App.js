import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./App.css";

function App() {
  const [activePis, setActivePis] = useState([]);
  const terminalRefs = useRef({});
  const fitAddons = useRef({});
  const terms = useRef({});
  const sockets = useRef({});

  const piAddresses = [
    { id: 1, ip: "192.168.56.101", name: "Raspberry Pi 1" },
    { id: 2, ip: "192.168.56.102", name: "Raspberry Pi 2" },
  ];

  useEffect(() => {
    activePis.forEach((pi) => {
      const piId = pi.id;

      if (!terms.current[piId]) {
        // Initialize the terminal and fit addon if not already initialized
        terms.current[piId] = new Terminal();
        fitAddons.current[piId] = new FitAddon();
        terms.current[piId].loadAddon(fitAddons.current[piId]);
      }

      const term = terms.current[piId];
      const fitAddon = fitAddons.current[piId];
      const terminalRef = terminalRefs.current[piId];

      if (!term.element && terminalRef) {
        // Open the terminal if not already opened
        term.open(terminalRef);
        fitAddon.fit();
        term.clear();
      }

      if (!sockets.current[piId]) {
        console.log(`Connecting to ${pi.name}`);
        fetch("http://localhost:3001/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: pi.ip }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((data) => {
            term.writeln(data);

            const socket = new WebSocket(`ws://localhost:3001`);
            sockets.current[piId] = socket;

            socket.onopen = () => {
              console.log(`WebSocket connected to ${pi.name}`);
              term.writeln(`Connected to ${pi.name} (${pi.ip})`);
            };

            socket.onmessage = (event) => {
              //  received data from WebSocket to the terminal
              term.write(event.data);
            };

            socket.onclose = () => {
              console.log(`WebSocket connection to ${pi.name} closed`);
              term.writeln(`Connection to ${pi.name} closed.`);
              sockets.current[piId] = null; 
            };

            socket.onerror = (err) => {
              console.log(`WebSocket error: ${err.message}`);
              term.writeln(`WebSocket error: ${err.message}`);
            };

            // Make sure onData is only registered once per terminal
            if (!term._onDataRegistered) {
              term.onData((input) => {
                if (socket.readyState === WebSocket.OPEN) {
                  // Send input data 
                  socket.send(input);
                }
              });
              term._onDataRegistered = true; // Flag to ensure no duplicate listeners
            }
          })
          .catch((error) => {
            term.writeln(`Error: ${error.message}`);
          });
      }
    });

    const localSockets = { ...sockets.current };

    return () => {
      const currentPis = activePis.map((pi) => pi.id);
      Object.keys(localSockets).forEach((piId) => {
        if (!currentPis.includes(parseInt(piId))) {
          console.log(`Closing WebSocket for ${piId}`);
          localSockets[piId].close();
        }
      });
    };
  }, [activePis]);

  const handlePiClick = (pi) => {
    if (!terms.current[pi.id]) {
      setActivePis((prevActivePis) => [...prevActivePis, pi]);
    }
  };

  const handleCloseTerminal = (pi) => {
    if (terms.current[pi.id]) {
      sockets.current[pi.id]?.close();
      terms.current[pi.id]?.dispose();

      delete terms.current[pi.id]; 
      delete fitAddons.current[pi.id]; 
      delete sockets.current[pi.id]; 
      setActivePis((prevActivePis) =>
        prevActivePis.filter((p) => p.id !== pi.id)
      );
    }
  };

  return (
    <div className="App">
      <h1>Raspberry Pi Network</h1>
      <div className="network-diagram">
        {piAddresses.map((pi) => (
          <div
            key={pi.id}
            className="pi-container"
            onClick={() => handlePiClick(pi)}
          >
            <img src={`/pi-image.png`} alt={pi.name} className="pi-image" />
            <p>{pi.name}</p>
          </div>
        ))}
        <div className="wire"></div>
      </div>

      <div className="terminal-container-wrapper">
        {activePis.map((pi) => (
          <div key={pi.id} className="terminal-container">
            <h2>Terminal for {pi.name}</h2>
            <button
              className="close-button"
              onClick={() => handleCloseTerminal(pi)}
            >
              X
            </button>
            <div
              ref={(el) => {
                if (el) {
                  if (!terminalRefs.current[pi.id]) {
                    terminalRefs.current[pi.id] = el;
                  }
                }
              }}
              className="terminal"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
