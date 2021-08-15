const mongoose = require('mongoose');
const keys = require('../config');

mongoose
	.connect(keys.mongodb_srv, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => console.log('Connected to database'))
	.catch((err) => console.log(err));
