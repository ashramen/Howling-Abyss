const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const summoner = require('../models/summonerSchema');
const keys = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recent')
    .setDescription('View your recent ARAM matches'),
  async execute(interaction) {
    const userId = interaction.user.id;
    await summoner.findOne(
      { userId: interaction.user.id },
      async function (err, user) {
        if (err) return;
        if (!user) {
          await interaction.reply('Use /summoner to register your account!');
          return;
        } else {
          const recentMatchesURL = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${user.summonerPuuid}/ids?queue=450&start=0&count=10&api_key=${keys.riot_key}`;
          const recentMatches = await fetch(recentMatchesURL).then((response) =>
            response.json(),
          );
          console.log(recentMatches);
          const matchMap = new Map();
          recentMatches.forEach(async function (match) {
            const matchInfo = await fetch(
              `https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${keys.riot_key}`,
            ).then((response) => response.json());
            index = matchInfo.metadata.participants.findIndex(
              (name) => name === user.summonerPuuid,
            );
            userInfo = matchInfo.info.participants[index];
            console.log(userInfo);
            const champ = {
              champLevel: userInfo.champLevel,
              champId: userInfo.champId,
              champName: userInfo.championName,
            };
            const kda = {
              win: userInfo.win ? 'Win' : 'Loss',
              kills: userInfo.kills,
              deaths: userInfo.deaths,
              spree: userInfo.largestKillingSpree,
            };
            matchMap.set(match, [champ, kda]);
            console.log(matchMap);
          });
        }
      },
    );
    await interaction.reply('Pong!');
  },
};
