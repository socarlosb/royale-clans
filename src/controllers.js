const {
  fetchPlayerData,
  fetchClanData,
  fetchClanWarLogs,
} = require("./vendor");
const { parsePlayerData } = require("./parsers");

const { addToMemory } = require("./middleware");
const { getClanData } = require("./helper");

exports.getOneClanData = async (req, res) => {
  try {
    const { tag } = req.params;

    const parsedData = await getClanData(tag);

    addToMemory(parsedData);

    res.json(parsedData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getOnePlayerData = async (req, res) => {
  try {
    const { tag } = req.params;
    const data = await fetchPlayerData(tag);

    let clanInfo, clanWarInfo;

    if (data.clan) {
      clanInfo = await fetchClanData(data.clan.tag);
      clanWarInfo = await fetchClanWarLogs(data.clan.tag);
    }

    const parsedData = parsePlayerData(data, clanInfo, clanWarInfo);
    res.json(parsedData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
