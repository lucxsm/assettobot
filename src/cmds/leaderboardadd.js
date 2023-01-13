const leaderboard = require('../leaderboard.js')
const { SlashCommandBuilder } = require('discord.js');
const { allowedRole } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboardadd')
		.setDescription('Add a new stracker leaderboard watch')
        .addChannelOption(option =>
            option.setName('channelid')
                .setDescription('The channel to echo into')
                .setRequired(true))
        .addStringOption(option =>
			option.setName('name')
				.setDescription('Name of the Server')
				.setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of Server')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('http://54.37.245.203:54301/lapstat<queryParams>')
                .setRequired(true)),
	async execute(interaction) {

        if(!interaction.member.roles.cache.has(allowedRole)){

            interaction.reply('You have no Permission to do that!');
            return false;
        }
    
        const channelId = interaction.options.getChannel('channelid');
        console.log(channelId.id)
        const channel = interaction.guild.channels.cache.get(channelId.id);

        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const url = interaction.options.getString('url');


        try {
            interaction.reply('Successfully created!');
            const embed = await leaderboard(url, description, name)
            channel.send({ embeds: [embed] })
        
        } catch (error) {
            interaction.reply('Could not add that leaderboard boss man, sorry.')
            console.error(error)
        }

	},
};