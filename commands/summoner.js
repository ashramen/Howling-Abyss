const keys = require('../config');
const summoner = require('../models/summonerSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summoner')
    .setDescription('Set your summoner name')
    .addStringOption((option) =>
      option.setName('name').setDescription('summoner name').setRequired(true),
    ),
  async execute(interaction) {
    let summonerName = interaction.options.getString('name');
    const reqURL = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${keys.riot_key}`;
    const summonerData = await fetch(reqURL)
      .then((response) => response.json())
      .catch((err) => {
        console.log(err);
      });
    if (summonerData.status) {
      console.log('Invalid');
      interaction.reply('Invalid summoner name 😦');
      return;
    }
    let query = { userId: interaction.user.id },
      update = {
        serverId: interaction.guildId,
        summonerName: summonerData.name,
        summonerId: summonerData.id,
        summonerPuuid: summonerData.puuid,
        summonerLevel: summonerData.summonerLevel,
        summonerProfileIconId: summonerData.profileIconId,
      },
      options = { upsert: true, new: true };

    summoner.findOneAndUpdate(
      query,
      update,
      options,
      async function (error, result) {
        if (error) return;
        await result.save();
      },
    );
    await interaction.reply(`Your summoner name has been saved! 😄`);
  },
};
