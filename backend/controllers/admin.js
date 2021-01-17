const Word = require("../models/Word");

exports.getIndex = (req, res) => {
  res.status(200).render("index");
};

exports.getAddWord = (req, res) => {
  res.status(200).render("edit-word");
};

exports.postWord = (req, res) => {
  const { name, definition } = req.body;

  const word = new Word({ name: name, definition: definition });
  word.save();
  console.log("Word Added to the database");
  res.status(201).redirect("/");
};
