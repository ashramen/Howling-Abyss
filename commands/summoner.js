const mongoose = require('mongoose');
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
		const summonerName = interaction.options.getString('name');
		const userId = interaction.user.id;
		const guildId = interaction.guildId;
		const reqURL = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${keys.riot_key}`;
		const summonerData = await fetch(reqURL)
			.then((response) => response.json())
			.catch((err) => {
				console.log(err);
			});
		if (summonerData.status) {
			console.log('Invalid');
			await interaction.reply('Invalid summoner name 😦');
			return;
		}
		const summonerId = await summonerData.id;
		console.log(summonerData);
		await interaction.reply(summonerName);
	},
};
