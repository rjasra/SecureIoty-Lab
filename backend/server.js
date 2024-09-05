const express = require("express");
const cors = require("cors");
const { Client } = require("ssh2");
const WebSocket = require("ws");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ noServer: true });

app.post("/connect", (req, res) => {
  const { ip } = req.body;
  const conn = new Client();

  conn
    .on("ready", () => {
      console.log(`SSH connection to ${ip} established.`);
      res.send("SSH connection established");

      wss.on("connection", (ws) => {
        conn.shell((err, stream) => {
          if (err) {
            console.error(`Shell error: ${err}`);
            ws.send(`Shell error: ${err.message}`);
            return;
          }

          stream
            .on("close", () => {
              console.log(`Shell closed for ${ip}`);
              conn.end();
            })
            .on("data", (data) => {
              ws.send(data.toString());
            });

          ws.on("message", (msg) => {
            stream.write(msg);
          });

          ws.on("close", () => {
            stream.end();
            console.log(`WebSocket connection closed for ${ip}`);
          });
        });
      });
    })
    .on("error", (err) => {
      console.error(`SSH error: ${err.message}`);
      res.status(500).send(`SSH connection error: ${err.message}`);
    })
    .connect({
      host: ip,
      port: 22,
      username: "pi",
      password: "pi",
    });
});

const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
