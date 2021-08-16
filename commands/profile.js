const { SlashCommandBuilder } = require('@discordjs/builders');
const summoner = require('../models/summonerSchema');
const { MessageEmbed } = require('discord.js');
const keys = require('../config');
const fetch = require('node-fetch');

async function getTopChamp(user, version) {
  const masteries = await fetch(
    `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${user.summonerId}?api_key=${keys.riot_key}`,
  ).then((response) => response.json());
  const topChampId = masteries[0].championId;
  const topChampPoints = masteries[0].championPoints;
  const championData = await fetch(
    `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
  ).then((response) => response.json());
  const championList = championData.data;
  let topChamp = '';
  for (var i in championList) {
    if (championList[i].key == topChampId) {
      topChamp = championList[i];
    }
  }
  return [topChamp, topChampPoints];
}

async function fetchVersionJSON() {
  const versionData = await fetch(
    `https://ddragon.leagueoflegends.com/api/versions.json`,
  )
    .then((response) => response.json())
    .then((versions) => versions[0]);
  return versionData;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your summoner profile'),
  async execute(interaction) {
    await interaction.deferReply();
    const version = await fetchVersionJSON();

    const getUser = async function (interaction) {
      try {
        return await summoner.findOne({ userId: interaction.user.id });
      } catch (err) {
        console.log(err);
      }
    };
    getUser(interaction).then((user) => {
      if (!user) {
        interaction.editReply('Use /summoner to register your account!');
        return;
      } else {
        getTopChamp(user, version).then((topChamp) => {
          const retEmbed = new MessageEmbed()
            .setTitle(`✨Summoner: ${user.summonerName}`)
            .setDescription('Welcome to the Howling Abyss!')
            .setColor('#87ceeb')
            .setThumbnail(
              `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${user.summonerProfileIconId}.png`,
            )
            .addFields(
              { name: 'Level:', value: `${user.summonerLevel}` },
              {
                name: 'Top Champion:',
                value: `${topChamp[0].name}, ${topChamp[0].title}: ${topChamp[1]}`,
                inline: true,
              },
            );
          return interaction.editReply({ embeds: [retEmbed] });
        });
      }
    });
  },
};
