const mongoose = require('mongoose');
const keys = require('../config');
const summoner = require('../models/summonerSchema');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summoner')
		.setDescription('Set your summoner name')
		.addStringOption((option) =>
			option.setName('name').setDescription('summoner name').setRequired(true),
		),
	async execute(interaction) {
		const summonerName = interaction.options.getString('name');
		console.log(summonerName);
		return interaction.reply(summonerName);
	},
};
