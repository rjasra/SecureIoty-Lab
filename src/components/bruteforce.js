import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./bruteforce.css";

function Bruteforce() {
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

      // Initialize terminal
      if (!terms.current[piId]) {
        terms.current[piId] = new Terminal();
        fitAddons.current[piId] = new FitAddon();
        terms.current[piId].loadAddon(fitAddons.current[piId]);
      }

      const term = terms.current[piId];
      const fitAddon = fitAddons.current[piId];
      const terminalRef = terminalRefs.current[piId];

      if (terminalRef && !term.element) {
        term.open(terminalRef);
        fitAddon.fit();
        term.clear();
      }

      // Initialize WebSocket
      if (!sockets.current[piId]) {
        console.log(`Connecting to ${pi.name}`);
        const socket = new WebSocket(`ws://localhost:3001/ws/${pi.ip}`);
        sockets.current[piId] = socket;

        socket.onopen = () => {
          term.writeln(`Connected to ${pi.name} (${pi.ip})`);
        };

        socket.onmessage = (event) => {
          term.write(event.data);
        };

        socket.onclose = () => {
          term.writeln(`Connection to ${pi.name} closed.`);
          sockets.current[piId] = null;
        };

        socket.onerror = (err) => {
          console.error(`WebSocket error on ${pi.name}:`, err);
          term.writeln("WebSocket error. Please try again.");
        };

        term.onData((input) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(input);
          }
        });
      }
    });

    return () => {
      // Cleanup when component unmounts or activePis changes
      const activePiIds = activePis.map((pi) => pi.id);
      Object.keys(sockets.current).forEach((piId) => {
        if (!activePiIds.includes(parseInt(piId))) {
          if (sockets.current[piId]) {
            sockets.current[piId].close();
            sockets.current[piId] = null;
          }
          terms.current[piId]?.dispose();
          delete terms.current[piId];
          delete fitAddons.current[piId];
        }
      });
    };
  }, [activePis]);

  const handlePiClick = (pi) => {
    setActivePis((prevActivePis) => {
      // Add the clicked Pi only if not already active
      if (!prevActivePis.some((p) => p.id === pi.id)) {
        return [...prevActivePis, pi];
      }
      return prevActivePis;
    });
  };

  const handleCloseTerminal = (pi) => {
    if (sockets.current[pi.id]) {
      sockets.current[pi.id].close();
      sockets.current[pi.id] = null;
    }

    terms.current[pi.id]?.dispose();
    delete terms.current[pi.id];
    delete fitAddons.current[pi.id];

    setActivePis((prevActivePis) =>
      prevActivePis.filter((p) => p.id !== pi.id)
    );
  };

  return (
    <div className="App">
      <button className="back-button" onClick={() => window.history.back()}>
        Back
      </button>
      <h1>Bruteforce Attack Simulation</h1>
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
                  terminalRefs.current[pi.id] = el;
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

export default Bruteforce;
