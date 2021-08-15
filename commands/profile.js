const { SlashCommandBuilder } = require('@discordjs/builders');
const summoner = require('../models/summonerSchema');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your summoner profile'),
  async execute(interaction) {
    const version = await fetch(
      'https://ddragon.leagueoflegends.com/api/versions.json',
    )
      .then((response) => response.json())
      .then((response) => response[0]);
    var retEmbed;
    await summoner.findOne(
      { userId: interaction.user.id },
      async function (err, existingUser) {
        if (err) return;
        if (!existingUser) {
          await interaction.reply('Use /summoner to add your account!');
          return;
        } else {
          retEmbed = new MessageEmbed()
            .setTitle(`✨Summoner: ${existingUser.summonerName}`)
            .setDescription('Welcome to the Howling Abyss!')
            .setColor('#87ceeb')
            .setThumbnail(
              `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${existingUser.summonerProfileIconId}.png`,
            );
        }
      },
    );
    await interaction.reply({ embeds: [retEmbed] });
  },
};
