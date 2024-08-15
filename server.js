const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.post("/execute", async (req, res) => {
  const { commands } = req.body;

  console.log("Received commands:", commands);
  try {
    if (!Array.isArray(commands) || commands.length === 0) {
      return res.status(400).send("Invalid commands array");
    }
    const results = await Promise.all(
      commands.map(
        ({ ip, command }) =>
          new Promise((resolve, reject) => {
            if (!ip) {
              return reject("IP address is missing");
            }
            if (!command) {
              return reject("Command is missing");
            }

            console.log(`Executing command on ${ip}: ${command}`);

            exec(`ssh pi@${ip} "${command}"`, (error, stdout, stderr) => {
              if (error) {
                return reject(`Error executing on ${ip}: ${error.message}`);
              }
              if (stderr) {
                console.error(`stderr from ${ip}: ${stderr}`);
              }
              resolve(`Output from ${ip}: ${stdout}`);
            });
          })
      )
    );

    res.send(results.join("\n"));
  } catch (error) {
    console.error(`exec error: ${error}`);
    res.status(500).send(`Error: ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
