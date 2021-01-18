const Word = require('../models/Word');

exports.getIndex = async (req, res) => {
  const result = { exists: false };
  const word = await Word.findOne({ name: req.query.word }).exec();

  if (word) {
    result.exists = true;
    result.name = word.name;
    result.definition = word.definition;
  }

  res.json(result);
};

// Use this to populate word defintions if they don't exists
exports.updateWordDefinition = async (req, res) => {
  const query = { name: req.body.word };
  const doc = await Word.findOneAndUpdate(query, {
    definition: req.body.definition,
  });

  res.status(204).send('Succefully Updated');
};
