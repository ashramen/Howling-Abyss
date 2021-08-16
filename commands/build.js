const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

function capitalizeFirstLetter(string) {
  return string
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

async function fetchVersionJSON() {
  const versionData = await fetch(
    `https://ddragon.leagueoflegends.com/api/versions.json`,
  )
    .then((response) => response.json())
    .then((versions) => versions[0]);
  return versionData;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('build')
    .setDescription('Get an ARAM build')
    .addStringOption((option) =>
      option.setName('champ').setDescription('Summoner name').setRequired(true),
    ),
  async execute(interaction) {
    const version = await fetchVersionJSON();
    const champName = capitalizeFirstLetter(
      interaction.options.getString('champ'),
    );
    const champNameForLink = champName.replace(/ /g, '');
    const retEmbed = new MessageEmbed()
      .setTitle(`${champName} ARAM Build`)
      .setDescription(
        `https://www.op.gg/aram/${champNameForLink}/statistics/450/build`,
      )
      .setThumbnail(
        `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champNameForLink}.png`,
      );
    return interaction.reply({ embeds: [retEmbed] });
  },
};
