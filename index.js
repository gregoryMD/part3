const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.post("/api/persons", (req, res) => {
  const newId = Math.floor(Math.random() * 200);
  const body = req.body;

  const person = {
    id: newId,
    name: body.name,
    number: body.number,
  };

  const exists = persons.some((p) => p.name == person.name);

  if (exists) {
    res.status(400).json({
      error: "this name is already in the phonebook",
    });
  } else if (!body.name) {
    res.status(400).json({
      error: "name must be included",
    });
  } else if (!body.number) {
    res.status(400).json({
      error: "number must be included",
    });
  } else {
    persons = persons.concat(person);

    res.json(person);
  }
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
