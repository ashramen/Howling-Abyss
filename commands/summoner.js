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
		const summonerPuuid = await summonerData.puuid;
		const summonerLevel = await summonerData.summonerLevel;
		const summonerProfileIconId = await summonerData.profileIconId;

		var query = { userId: interaction.user.id },
			update = {
				serverId: interaction.guildId,
				summonerName: summonerName,
				summonerId: summonerId,
				summonerPuuid: summonerPuuid,
				summonerLevel: summonerLevel,
				summonerProfileIconId: summonerProfileIconId,
			},
			options = { upsert: true, new: true };

		summoner.findOneAndUpdate(query, update, options, function (error, result) {
			if (error) return;
		});
		console.log(summonerData);
		await interaction.reply(`Your summoner name has been saved! 😄`);
	},
};
