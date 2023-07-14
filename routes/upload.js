const blob = require('../blob');
const db = require('../db');

const uploadUrl = async (req, res) => {
  const { id } = req.params;
  const sasUrl = await blob.uploadUrl('$web', `${id}.jpg`);
  return res.json({
    sasUrl,
  });
};

const finalizeUrl = async (req, res) => {
  const { id } = req.params;

  await db.updateCircuritImage({ _id: id });
  res.json({
    ok: true,
  });
};

module.exports = {
  uploadUrl,
  finalizeUrl,
};
