const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://gdiehl265:${password}@cluster0.rzxoox5.mongodb.net/phoneBookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((pers) => {
      const personString = `${pers.name} ${pers.number}`;
      console.log(personString);
    });
    mongoose.connection.close();
  });
}
