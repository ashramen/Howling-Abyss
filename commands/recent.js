const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const summoner = require('../models/summonerSchema');
const keys = require('../config');
const { MessageEmbed } = require('discord.js');

function getMilliToDuration(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recent')
    .setDescription('View your recent ARAM matches'),
  async execute(interaction) {
    await interaction.deferReply();
    const userId = interaction.user.id;
    await summoner.findOne(
      { userId: interaction.user.id },
      async function (err, user) {
        if (err) return;
        if (!user) {
          await interaction.editReply(
            'Use /summoner to register your account!',
          );
          return;
        } else {
          const recentMatchesURL = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${user.summonerPuuid}/ids?queue=450&start=0&count=10&api_key=${keys.riot_key}`;
          const recentMatches = await fetch(recentMatchesURL).then((response) =>
            response.json(),
          );
          const matchMap = new Map();
          for (match of recentMatches) {
            const matchInfo = await fetch(
              `https://americas.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${keys.riot_key}`,
            ).then((response) => response.json());
            index = matchInfo.metadata.participants.findIndex(
              (name) => name === user.summonerPuuid,
            );
            const startTime = new Date(matchInfo.info.gameCreation)
              .toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              .slice(0, -6);
            const gameDur = getMilliToDuration(matchInfo.info.gameDuration);
            userInfo = matchInfo.info.participants[index];
            const champ = {
              champLevel: userInfo.champLevel,
              champId: userInfo.championId,
              champName: userInfo.championName,
              win: userInfo.win ? 'Win' : 'Loss',
              kills: userInfo.kills,
              deaths: userInfo.deaths,
              assists: userInfo.assists,
              spree: userInfo.largestKillingSpree,
              start: startTime,
              totalDamage: userInfo.totalDamageDealtToChampions,
              totalMitigated: userInfo.totalDamageTaken,
              totalHealed: userInfo.totalHeal,
              totalShielded: userInfo.totalDamageShieldedOnTeammates,
              matchDuration: gameDur,
            };
            matchMap.set(match, champ);
          }
          let retEmbed = new MessageEmbed()
            .setTitle(`⚔️ ${user.summonerName}'s Recent Matches`)
            .setDescription('You win some, you lose some 😉');
          let matchArray = [];
          for (let [game, res] of matchMap) {
            let winEmoji = res.win === 'Win' ? '✅' : '❌';
            matchArray.push({
              title: `${winEmoji} ${res.win} - ${res.champName}  ${res.start}`,
              val: `⬛  KDA: ${res.kills}/${res.deaths}/${res.assists}
              ⬛  Duration: ${res.matchDuration}`,
              inl: false,
            });
          }
          for (let game of matchArray) {
            retEmbed.addField(game.title, game.val, game.inl);
          }
          await interaction.editReply({ embeds: [retEmbed] });
        }
      },
    );
  },
};
