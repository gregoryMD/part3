require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const Person = require("./models/person");

morgan.token("content", (req, res) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.content(req, res),
    ].join(" ");
  })
);
app.use(express.static("build"));

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({
      error: "name must be included",
    });
  } else if (!body.number) {
    res.status(400).json({
      error: "number must be included",
    });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  }
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  const length = persons.length;
  const current = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  const message = `Phonebook has info for ${length} people on ${current}`;

  res.send(`<p>${message}</p>`);
  console.log(message, current);
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(request.params.id).then((person) => response.json(person));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end;
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
