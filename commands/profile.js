const { SlashCommandBuilder } = require('@discordjs/builders');
const summoner = require('../models/summonerSchema');
const { MessageEmbed } = require('discord.js');
const keys = require('../config');
const fetch = require('node-fetch');
const getTopChamp = require('../command-helpers/topChamp.js');
const fetchVersionJSON = require('../command-helpers/getVersion');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your summoner profile'),
  async execute(interaction) {
    await interaction.deferReply();
    const getUser = async function (interaction) {
      try {
        return await summoner.findOne({ userId: interaction.user.id });
      } catch (err) {
        console.log(err);
      }
    };
    getUser(interaction).then((user) => {
      if (!user) {
        interaction.editReply('Use /summoner to register your account!');
        return;
      } else {
        let version;
        fetchVersionJSON().then((version) => {
          version = version[0];
        });
        getTopChamp(user).then((topChamp) => {
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
                value: `${topChamp}: 392,372`,
                inline: true,
              },
            );
          return interaction.editReply({ embeds: [retEmbed] });
        });
      }
    });
  },
};
