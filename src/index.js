const dotenv = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const scheduler = require('./scheduler.js');
const path = require('path');
const { botId, clientId, guildId, token, configChannels } = require('./config.json');

dotenv.config();

global.infoScheduleDelay = 15000; // every minute
global.leaderboardScheduleDelay = 15000; // every five minutes
global.botId = String(botId);
global.channels = String(configChannels).split(',');
global.bannedWords = String(process.env.BANNED_WORDS).split(',');

const client = new Client({ presence: {
	status: 'idle',
	afk: false,
	activities: [{
		name: 'Assetto Servers',
		type: ActivityType.Competing 
	}],
}, intents: [GatewayIntentBits.Guilds] });


client.commands = new Collection();

const commandsPath = path.join(__dirname, 'cmds');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



const scheduleServerInfoUpdates = () => setTimeout(async () => {
    await scheduler.updateServerInfo(client)
    scheduleServerInfoUpdates()
}, global.infoScheduleDelay)


const scheduleLeaderboardUpdates = () => setTimeout(async () => {
    await scheduler.updateLeaderboards(client)
    scheduleLeaderboardUpdates()
}, global.leaderboardScheduleDelay) 

scheduleServerInfoUpdates()
scheduleLeaderboardUpdates()

client.login(token).then(() => console.log('Connected'));
