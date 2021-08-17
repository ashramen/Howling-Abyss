const { SlashCommandBuilder } = require('@discordjs/builders');
const Summoner = require('../models/summonerSchema');
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
    .setDescription('View your summoner profile')
    .addStringOption((option) =>
      option.setName('name').setDescription('Summoner name'),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const version = await fetchVersionJSON();

    const getUser = async function (interaction) {
      if (interaction.options.getString('name')) {
        sumName = interaction.options.getString('name').toLowerCase();
        try {
          return await Summoner.findOne({ summonerNameLowerCase: sumName });
        } catch (err) {
          console.log(err);
        }
      }
      try {
        return await Summoner.findOne({ userId: interaction.user.id });
      } catch (err) {
        console.log(err);
      }
    };
    getUser(interaction).then((user) => {
      if (!user) {
        console.log('summoner not found');
        interaction.editReply(
          'Summoner not registered. Use /summoner to register your account!',
        );
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
                value: `${topChamp[0].name}, ${topChamp[0].title}: ${topChamp[1]} mastery points`,
                inline: true,
              },
            );
          return interaction.editReply({ embeds: [retEmbed] });
        });
      }
    });
  },
};
