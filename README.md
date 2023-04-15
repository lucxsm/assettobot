# assettobot
![img123](https://img.shields.io/github/stars/lucxsm/assettobot?style=for-the-badge)
![img321](https://img.shields.io/github/repo-size/lucxsm/assettobot?style=for-the-badge)
![discord](https://img.shields.io/discord/993538816965083206?style=for-the-badge)

A updated Version from SRP-Bot with the latest Discord.js

With /serveradd you can add a Status-Embed.

With /leaderboardadd you can add a Leaderboard-Embed

# Configuration
```
token = Your Secret Bot Token
clientId = Client ID from your Bot
guildId = Guild ID to deploy the Commands
botId = The User Bot ID (right click the bot and copy the id in discord)
configChannels = Channels for monitoring the messages
allowedRole = which role can use the commands
```

# Installation
Install NodeJS, you can find it [here](https://nodejs.org/en/download/)

Clone the Repository and install all Packages.
```
git clone https://github.com/lucxsm/assettobot.git
```

```
npm install
```

Configure the Configfile and then deploy the Commands.
```
cd src
node deploy_commands.js
```

Then you can start the Bot with
```
cd ..
node src/index.js
```
Normally it should be showing now a "Connected". Then you are good to go.

# Commands
With /serveradd you can add a Embed.
```
/serveradd Channel-ID Embedtitle Serveraddress Countrycode Description
```
The country code is two digits (de, us, nl,...)
If your Country is missing, you can add this in the nationalities.js

The Serveraddress must be like 127.0.0.1:8084 (IP:PORT)

/leaderboardadd

This Command is currently work in progress

# Customize
To customize the Embed, you can edit the serverinfo.js

# Example Embeds

![Example2](https://images-ext-1.discordapp.net/external/q9so1se0ZuROuaIVwPE-dRFYXmXE8KDa5P67mLjueV0/https/i.imgur.com/NC7KJPm.png?width=366&height=681)

![Example](https://i.imgur.com/Dx9aOC0.png)

# Original Version

Github: [christian-kth/srp-bot](https://github.com/christian-kth/srp-bot)
