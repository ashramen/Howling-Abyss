const mongoose = require('mongoose');
const keys = require('../config');
const summoner = require('../models/summonerSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('beep').setDescription('Beep!'),
	async execute(interaction) {
		return interaction.reply('Boop!');
	},
};
