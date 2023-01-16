const api = require('./api.js');
const utils = require('./utils.js');
const leaderboard = require('./leaderboard.js');

const updateServerInfo = async (client) => {
    const messages = await utils.allMessagesFromChannelList(client);
    const filteredMessages = messages.filter(msg => {
        const embed = msg.embeds[0];
        if (embed && embed.author && !embed.author.name.startsWith('Leaderboard')) {
          return true;
        }
        return false;
    });


    if (filteredMessages.length > 0) {
        await Promise.all(filteredMessages.map(async msg => {

            const embed = msg.embeds[0];
            const address = embed.fields.find(field => field.name === 'Address:').value.split('`')[1];
    
            try {
                const serverData = await api.fetchInfo(address);
                const newMessage = Object.assign(embed);
                const timestampEdit = new Date();
                newMessage.fields.find(field => field.name === 'Players:').value = `:busts_in_silhouette: ${serverData.currentPlayers || 0}/${serverData.maxPlayers || 0}`;
                newMessage.fields.find(field => field.name === 'Status:').value = serverData.status;
                newMessage.data.timestamp = timestampEdit;
                await msg.edit({ embeds: [newMessage] });
            } catch (error) {
                console.error('Something went wrong while trying to edit the server info message: ', error);
            }
        }));
        console.log('Finished updating server info for all servers.');
    }
};

const updateLeaderboards = async (client) => {
    const messages = await utils.allMessagesFromChannelList(client)
    const filteredMessages = messages.filter(msg => {
        const embed = msg.embeds[0];

        
        if (embed && embed.author.name.startsWith('Leaderboard')) {
          return true;
        }
        return false;
    });
    
    if (filteredMessages.length > 0) {
        await Promise.all(filteredMessages.map(async msg => {
            if(msg.embeds && msg.embeds[0].author){
                const embed = msg.embeds[0]
                const strackerUrl = embed.url
                const description = embed.description
                const name = embed.author.name
				const timestampEdit = new Date();
                try {
                    const newMessage = await leaderboard(strackerUrl, description, name)
					newMessage.data.timestamp = timestampEdit;
                    await msg.edit({ embeds: [newMessage] })
                } catch (error) {
                    console.error('An error occurred while trying to update the leaderboard message', error)
                }
            }
        }))
        console.log('Finished updating all leaderboards')
    }
}


module.exports = {
    updateServerInfo,
    updateLeaderboards
};