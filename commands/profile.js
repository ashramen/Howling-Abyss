const { SlashCommandBuilder } = require('@discordjs/builders');
const summoner = require('../models/summonerSchema');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your summoner profile'),
  async execute(interaction) {
    let version = '11.16.1';
    var retEmbed;
    await summoner.findOne(
      { userId: interaction.user.id },
      async function (err, user) {
        if (err) return;
        if (!user) {
          await interaction.reply('Use /summoner to register your account!');
          return;
        } else {
          retEmbed = new MessageEmbed()
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
                value: 'Some value here',
                inline: true,
              },
              {
                name: 'Inline field title',
                value: 'Some value here',
                inline: true,
              },
            );
        }
      },
    );
    await interaction.reply({ embeds: [retEmbed] });
  },
};
