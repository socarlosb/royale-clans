const {
  fetchPlayerData,
  fetchClanData,
  fetchClanWarLogs
} = require("./vendor");
const { parseClanData, parsePlayerData } = require("./parsers");

exports.getOneClanData = async (req, res) => {
  try {
    const { tag } = req.params;
    const data = await fetchClanData(tag);
    const warData = await fetchClanWarLogs(tag);

    const members = [];
    data.memberList
      ? await Promise.all(
          data["memberList"].map(async ({ tag }) => {
            members.push(await fetchPlayerData(tag));
          })
        )
      : null;

    const parsedData = parseClanData(data, warData, members);
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
