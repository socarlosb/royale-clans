const {
  fetchPlayerData,
  fetchClanData,
  fetchClanWarLogs,
} = require("./vendor");
const { parseClanData } = require("./parsers");

const getClanData = async (tag) => {
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
  return parseClanData(data, warData, members);
};

module.exports = { getClanData };
