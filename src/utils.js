const Filter = require("bad-words");

const allMessagesFromChannelList = async (client) => {
    const channels = global.channels.map(id => client.channels.cache.get(id));

    try {
        const messages = await Promise.all(channels.map(async channel => await channel.messages.fetch({limit: 50})));
        return messages.map(collection => collection.map(value => value))
            .flat()
            .filter(msg => msg.author.id === global.botId);
    } catch (error) {
        console.error('An error occurred while trying to fetch the channels: ', error);
        return [];
    }
};

const replaceQueryParam = (urlString, param, newValue = '') => {
    const url = new URL(urlString);
    const search = url.search;
    const regex = new RegExp('([?;&])' + param + '[^&;]*[;&]?');
    const query = search.replace(regex, '$1').replace(/&$/, '');

    return (url.protocol + '//' + url.host + url.pathname) + (query.length > 2 ? query + '&' : '?') + (param + '=' + newValue);
};

const clean = (string) => {
    const filter = new Filter();
    filter.addWords(...global.bannedWords);
    return filter.clean(string);
};

module.exports = {
    allMessagesFromChannelList,
    replaceQueryParam,
    clean
};