const { SlashCommandBuilder } = require('@discordjs/builders');
const { Kayn, REGIONS } = require('kayn');
const keys = require('../config');

const kayn = Kayn('RGAPI-my-api-key');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    await interaction.reply('Pong!');
  },
};
