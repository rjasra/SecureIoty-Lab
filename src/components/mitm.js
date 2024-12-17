import React, { useState, useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import "./mitm.css";

function mitm() {
  const [activePis, setActivePis] = useState([]);
  const terminalRefs = useRef({});
  const fitAddons = useRef({});
  const terms = useRef({});
  const sockets = useRef({});

  const piAddresses = [
    { id: 1, ip: "192.168.56.101", name: "Raspberry Pi 1" },
    { id: 2, ip: "192.168.56.102", name: "Raspberry Pi 2" },
    { id: 3, ip: "192.168.56.103", name: "Attacker Pi (MITM)" },
  ];

  useEffect(() => {
    activePis.forEach((pi) => {
      const piId = pi.id;
      if (!terms.current[piId]) {
        terms.current[piId] = new Terminal({
          cursorBlink: true,
          disableStdin: false,
          allowProposedApi: true,
        });
        fitAddons.current[piId] = new FitAddon();
        terms.current[piId].loadAddon(fitAddons.current[piId]);
      }

      const term = terms.current[piId];
      const fitAddon = fitAddons.current[piId];
      const terminalRef = terminalRefs.current[piId];

      if (!term.element && terminalRef) {
        term.open(terminalRef);
        fitAddon.fit();
        term.clear();
      }

      if (!sockets.current[piId]) {
        fetch("http://localhost:3001/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip: pi.ip }),
        })
          .then((response) => response.text())
          .then((data) => {
            term.writeln(data);
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
              term.writeln(`WebSocket error: ${err.message}`);
            };

            term.onData((input) => {
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(input);
              }
            });
          })
          .catch((error) => {
            term.writeln(`Error: ${error.message}`);
          });
      }
    });

    return () => {
      const currentPis = activePis.map((pi) => pi.id);
      Object.keys(sockets.current).forEach((piId) => {
        if (!currentPis.includes(parseInt(piId))) {
          sockets.current[piId]?.close();
        }
      });
    };
  }, [activePis]);

  const handlePiClick = (pi) => {
    if (!activePis.some((p) => p.id === pi.id)) {
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
      <button className="back-button" onClick={() => window.history.back()}>
        Back
      </button>
      <h1>Man-in-the-middle Attack Simulation</h1>
      <div className="network-diagram">
        <div
          className="attacker-container"
          onClick={() =>
            handlePiClick({ id: 3, ip: "192.168.56.103", name: "Attacker Pi" })
          }
        >
          <img src={`/pi-image.png`} alt="Attacker Pi" className="pi-image" />
          <p>Attacker Pi</p>
        </div>

        <div className="line-container">
          <div
            className="pi-container"
            onClick={() =>
              handlePiClick({
                id: 1,
                ip: "192.168.56.101",
                name: "Raspberry Pi 1",
              })
            }
          >
            <img
              src={`/pi-image.png`}
              alt="Raspberry Pi 1"
              className="pi-image"
            />
            <p>Raspberry Pi 1</p>
          </div>

          <div className="straight-line"></div>

          <div
            className="pi-container"
            onClick={() =>
              handlePiClick({
                id: 2,
                ip: "192.168.56.102",
                name: "Raspberry Pi 2",
              })
            }
          >
            <img
              src={`/pi-image.png`}
              alt="Raspberry Pi 2"
              className="pi-image"
            />
            <p>Raspberry Pi 2</p>
          </div>
        </div>
      </div>

      <div className="mitm-terminal-container-wrapper">
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
              ref={(ref) => (terminalRefs.current[pi.id] = ref)}
              className="terminal"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default mitm;
