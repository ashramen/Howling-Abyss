const mongoose = require('mongoose');

const versionData = new mongoose.Schema({
  currentVersion: String,
});

const Version = mongoose.model('version', versionData);

module.exports = Version;
