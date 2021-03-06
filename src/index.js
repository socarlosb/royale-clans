const express = require("express");
const cors = require("cors");

const { getOneClanData, getOnePlayerData } = require("./controllers");
const { checkMemory } = require("./middleware");

const App = express();

App.use(cors());
App.use(express.json());

// '/api/clan/:tag' get clan info
App.get("/api/clan/:tag", checkMemory, getOneClanData);

// '/api/clans' get all clans info
// App.get("/api/clans", (req, res) => {});

// '/api/player/:tag' get player info
App.get("/api/player/:tag", getOnePlayerData);

App.get("*", (_, res) => {
  res.status(404).json({ message: "nothing to see here" });
});

module.exports = { App };
