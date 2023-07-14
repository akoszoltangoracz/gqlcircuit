const { ObjectId } = require("mongodb");
const db = require('./db');

const getComponents = ({ componentIds = [] }) => {
	const query = {};

	if (componentIds.length) {
		query._id = {
			$in: componentIds.map(c => new ObjectId(c))
		}
	}
	return db.components.find(query).toArray();
};

const createComponent = ({ name, type }) => {
	return db.components.insertOne({
		name,
		type,
	});
};

const updateComponent = ({ _id, name, type }) => {
	return db.components.updateOne({ _id: new ObjectId(_id) },
	{
		$set: {
			name,
			type,
		}
	});
};

const getComponent = _id => db.components.findOne({ _id: new ObjectId(_id) });

const getComponentCount = () => {
	return db.components.count({});
};

module.exports = {
	getComponents,
	createComponent,
	updateComponent,
	getComponent,
	getComponentCount,
};
