const { ObjectId } = require("mongodb");
const db = require('./db');

const createCircurit = ({ name, description, componentIds = [] }) => {
	const components = componentIds.map(c => new ObjectId(c));
	return db.circurits.insertOne({
		name,
		description,
		componentIds: components,
	});
};

const updateCircurit = ({ _id, name, description, componentIds = [] }) => {
	const components = componentIds.map(c => new ObjectId(c));
	return db.circurits.updateOne({ _id: new ObjectId(_id) },
	{
		$set: {
			name,
			description,
			componentIds: components,
		}
	});
};

const updateCircuritImage = ({ _id }) => {
	return db.circurits.updateOne({ _id: new ObjectId(_id) },
	{
		$set: {
			hasImage: true,
		},
	});
};

const getCircurit = _id => db.circurits.findOne({ _id: new ObjectId(_id) });

const getCircurits = ({ sort = {} }) => {
	const sortDir = sort?.dir === 'asc' ? 1 : -1;
	const sortField = sort?.field || 'name';
	const sortExpr = {
		[sortField]: sortDir,
	};

	return db.circurits.find({})
		.sort(sortExpr)
		.toArray();
};

const getCircuritsByComponentId = componentId => {
	return db.circurits.find({
		componentIds: new ObjectId(componentId),
	}).toArray();
};

const getCircuritCount = async () => {
	const count = await db.circurits.count({});
	console.log('circ count', count);
	return count;
};

module.exports = {
	getCircurit,
	createCircurit,
	updateCircurit,
	getCircurits,
	getCircuritsByComponentId,
	updateCircuritImage,
	getCircuritCount,
};
