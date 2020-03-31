const axios = require("axios");
const { VENDOR_TOKEN, VENDOR_URL } = require("./configs");

const encodeTag = tag => {
  if (tag.includes("#")) {
    return encodeURIComponent(tag);
  } else {
    return encodeURIComponent(`#${tag.toUpperCase()}`);
  }
};

// get clan info endpoint
exports.fetchClanData = async tag => {
  const cleanTag = encodeTag(tag);
  try {
    const result = await axios.get(`${VENDOR_URL}/clans/${cleanTag}`, {
      headers: {
        Authorization: `Bearer ${VENDOR_TOKEN}`
      }
    });
    return result.data;
  } catch (error) {
    return { error: error.message };
  }
};

// get clan war info endpoint
exports.fetchClanWarLogs = async tag => {
  const cleanTag = encodeTag(tag);
  try {
    const result = await axios.get(`${VENDOR_URL}/clans/${cleanTag}/warlog`, {
      headers: {
        Authorization: `Bearer ${VENDOR_TOKEN}`
      }
    });

    return result.data.items;
  } catch (error) {
    return { error: error.message };
  }
};

// get player info endpoint
exports.fetchPlayerData = async tag => {
  const cleanTag = encodeTag(tag);
  try {
    const result = await axios.get(`${VENDOR_URL}/players/${cleanTag}`, {
      headers: {
        Authorization: `Bearer ${VENDOR_TOKEN}`
      }
    });

    return result.data;
  } catch (error) {
    return { error: error.message };
  }
};
