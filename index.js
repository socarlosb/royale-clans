const { config } = require("dotenv");
config();

const { App } = require("./src");
const { PORT, NODE_ENV } = require("./src/configs.js");

App.listen(PORT, () => {
  console.info("----------------");
  console.info(`Server running in "${NODE_ENV}" mode on port: ${PORT}`);
  console.info("----------------");
});
