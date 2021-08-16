const mongoose = require('mongoose');

const summonerSchema = new mongoose.Schema({
  userId: { type: String, require: true, unique: true },
  serverId: { type: String, require: true },
  summonerName: String,
  summonerId: String,
  summonerPuuid: String,
  summonerLevel: Number,
  summonerProfileIconId: Number,
  summonerPfp: String,
});

const summoner = mongoose.model('summoner', summonerSchema);

module.exports = summoner;
