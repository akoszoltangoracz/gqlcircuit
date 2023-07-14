const { MongoClient, ObjectId } = require("mongodb");
const components = require('./components');
const circurits = require('./circurits');

const db = require('./db');

const connect = async () => {
	const client = new MongoClient(process.env.MONGO_URI);
	await client.connect()
	const database = client.db('circurits')

	db.db = database;
	db.circurits = database.collection('circurits');
	db.components = database.collection('components');

	console.log('db connected')
};

module.exports = {
    connect,
	db,
    ...components,
    ...circurits,
};
