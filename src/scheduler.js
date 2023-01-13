const api = require('./api.js');
const utils = require('./utils.js');

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
                console.log(newMessage)
                await msg.edit({ embeds: [newMessage] });
            } catch (error) {
                console.error('Something went wrong while trying to edit the server info message: ', error);
            }
        }));
        console.log('Finished updating server info for all servers.');
    }
};


module.exports = {
    updateServerInfo
};