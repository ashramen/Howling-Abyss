const { SlashCommandBuilder } = require('@discordjs/builders');
const summoner = require('../models/summonerSchema');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your summoner profile'),
  async execute(interaction) {
    summoner.findOne(
      { userId: interaction.user.id },
      function (err, existingUser) {
        if (err) return;
        if (!existingUser) {
          return interaction.reply('Use /summoner add to add your account!');
        } else {
          const retEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`✨Summoner Profile: ${existingUser.summonerName}`)
            .setDescription('Welcome to the Howling Abyss!')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
              { name: 'Regular field title', value: 'Some value here' },
              { name: '\u200B', value: '\u200B' },
              {
                name: 'Inline field title',
                value: 'Some value here',
                inline: true,
              },
              {
                name: 'Inline field title',
                value: 'Some value here',
                inline: true,
              },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png');
          return interaction.channel.send({ embeds: [retEmbed] });
        }
      },
    );
  },
};
