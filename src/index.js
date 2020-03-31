const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { getOneClanData, getOnePlayerData } = require("./controllers");

const limiter = rateLimit({
  windowMs: 5000,
  max: 1,
  message: "too many requests, try again in a 5 seconds"
});

const App = express();

App.use(cors());
App.use(express.json());
App.use(limiter);

// '/api/clan/:tag' get clan info
App.get("/api/clan/:tag", getOneClanData);

// '/api/clans' get all clans info
// App.get("/api/clans", (req, res) => {});

// '/api/player/:tag' get player info
App.get("/api/player/:tag", getOnePlayerData);

App.get("*", (req, res) => {
  res.status(404).json({ message: "nothing to see here" });
});

module.exports = { App };
