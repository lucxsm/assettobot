const { EmbedBuilder } = require('discord.js');

module.exports = (serverInfo) => {
    const ip = serverInfo.address.split(':')[0];
    const port = serverInfo.address.split(':')[1];
    return new EmbedBuilder()
        .setColor('#42e3f5')
        .setTitle('Click here to connect!')
        .setDescription(serverInfo.description)
        .setURL(`https://acstuff.ru/s/q:race/online/join?ip=${ip}&httpPort=${port}`)
        .setAuthor({ name: serverInfo.serverName, iconURL: 'https://cdn.discordapp.com/attachments/1055890908761038900/1062129961881849986/al-klein.png', url: 'https://lucscripts.nl' })
        .setThumbnail('https://cdn.discordapp.com/attachments/1055890908761038900/1062129961881849986/al-klein.png')
        .setImage('https://cdn.discordapp.com/attachments/1056458048761245796/1061738788113629194/assettorules.png')
        .addFields(
            { name: 'Status:', value: serverInfo.status, inline: true },
            { name: 'Players:', value: `:busts_in_silhouette: ${serverInfo.currentPlayers || 0}/${serverInfo.maxPlayers || 0}`, inline: true },
            { name: 'Location:', value: serverInfo.country, inline: true },
            { name: 'Address:', value: `:desktop: \`${serverInfo.address}\``, inline: true },
        )
        .setTimestamp();
}