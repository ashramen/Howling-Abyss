require('dotenv').config();

module.exports = {
    key: {
      token: process.env.DISCORDJS_BOT_TOKEN,
      client_id: process.env.DISCORDJS_CLIENT_ID,
      guild_id: process.env.DISCORDJS_GUILD_ID,
    }
};