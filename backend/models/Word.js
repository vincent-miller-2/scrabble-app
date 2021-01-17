const mongoose = require("mongoose");

const WordSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("words", WordSchema);
