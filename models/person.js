const mongoose = require("mongoose");

mongoose.set("strictQuery".false);
const url = process.env.MONGODB_URI;

console.log("conecting to", url);

mongoose.connect(url);

const personSchema = new monggose.Schema({
  name: String,
  number: String,
});

const Person = monggose.model("Person", personSchema);
