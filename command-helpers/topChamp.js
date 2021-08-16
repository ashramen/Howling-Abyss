const keys = require('../config');
const fetch = require('node-fetch');

async function getTopChamp(user) {
  const masteries = await fetch(
    `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${user.summonerId}?api_key=${keys.riot_key}`,
  ).then((response) => response.json());
  const topChamp = masteries[0].championId;
}
module.exports = getTopChamp;
