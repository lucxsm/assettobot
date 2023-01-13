const api = require('../api.js')
const nationalities = require('../nationalities.js')
const getServerInfo = require('../serverinfo.js')
const { SlashCommandBuilder } = require('discord.js');
const { allowedRole } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serveradd')
		.setDescription('Add a new server spectator')
        .addChannelOption(option =>
            option.setName('channelid')
                .setDescription('The channel to echo into')
                .setRequired(true))
        .addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the Server')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('address')
                .setDescription('IP Address:Port of the Assetto Server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('country')
                .setDescription('Shortcode of Country from Server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of Server')
                .setRequired(true)),
	async execute(interaction) {
    
        if(!interaction.member.roles.cache.has(allowedRole)){

            interaction.reply('You have no Permission to do that!');
            return false;
        }

        const channelId = interaction.options.getChannel('channelid');
        console.log(channelId.id)
        const channel = interaction.guild.channels.cache.get(channelId.id);

        const serverName =  interaction.options.getString('name');
        const address =  interaction.options.getString('address');
        const countryKey = interaction.options.getString('country');
        const description = interaction.options.getString('description');

        const countryFromKey = nationalities.getCountry(countryKey) || {}
        const country = `${countryFromKey.flag} ${countryFromKey.name}`

        try {
            const serverData = await api.fetchInfo(address)
            const embed = getServerInfo({description, serverName, address, country,...serverData})
            console.log(embed)
            channel.send({ embeds: [embed] });
            await interaction.reply(`Successfully created!`);
        } catch (error) {
            await interaction.reply(`Something went wrong, sorry!`);
            console.error(error)
        }

	},
};