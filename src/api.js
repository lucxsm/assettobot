const fetch = require('node-fetch');

const OFFLINE_RESPONSE = {
    status: ':red_circle: Offline',
    currentPlayers: 0,
    maxPlayers: 0
};

const fetchInfo = async (address) => {

    try {
        const response = await fetch(`http://${address}/INFO`, {'Content-Type': 'application/json'});
        const json = response.status === 200 ? await response.json() : {failed: true};

        return json.failed ? OFFLINE_RESPONSE : {
            status: ':green_circle: Online',
            currentPlayers: json.clients,
            maxPlayers: json.maxclients,
        };
    } catch (error) {
        console.error('Could not fetch server info for ' + address + '! ', error);
        return OFFLINE_RESPONSE;
    }
}

module.exports = {
    fetchInfo
};