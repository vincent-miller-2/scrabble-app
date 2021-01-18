const csv = require("csv-parser");
const fs = require("fs");
const Word = require("../models/Word");

// Used only once to put scrabble dictionary in db because I'm not doing it by hand
exports.getIndex = async (req, res) => {
  const documentList = [];

  // We only want this to happen once so check db count
  await Word.estimatedDocumentCount((err, count) => {
    if (count) {
      console.log(count);
    } else {
      fs.createReadStream(__dirname + "/../data.csv")
        .pipe(csv())
        .on("data", (row) => {
          const word = new Word({
            name: row.word.toLowerCase(),
            definition: "",
          });
          documentList.push(word);
        })
        .on("end", () => {
          console.log("CSV file successfully processed");
        });
    }
  });

  // Not sure how to do the insert inside the first db call, so this is here for now
  if (documentList) {
    await Word.insertMany(documentList);
  }

  res.status(200).render("index");
};
