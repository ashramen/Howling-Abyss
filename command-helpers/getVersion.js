const fetch = require('node-fetch');

async function fetchVersionJSON() {
  const versionData = await fetch(
    `https://ddragon.leagueoflegends.com/api/versions.json`,
  ).then((response) => response.json());
  return versionData;
}
module.exports = fetchVersionJSON;
