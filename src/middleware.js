const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const { getClanData } = require("./helper");

db.defaults({ clans: [] }).write();

const checkMemory = async (req, res, next) => {
  const { tag } = req.params;

  const dataInMem = await db
    .get("clans")
    .find({ tag: "#" + tag })
    .value();
  if (dataInMem) {
    res.json(dataInMem);

    setTimeout(async () => {
      const parsedData = await getClanData(tag);
      await updateToMemory(parsedData);
      console.info("clan updated:", parsedData.name, parsedData.updatedAt);
      console.info("----------------");
    }, 5000);
  } else {
    next();
  }
};

function addToMemory(el) {
  db.get("clans").push(el).write();
}
async function updateToMemory(el) {
  await db.get("clans").find({ tag: el.tag }).assign(el).write();
}

module.exports = { checkMemory, addToMemory };
