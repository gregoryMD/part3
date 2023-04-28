/* eslint-disable no-unused-expressions */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();
const cors = require("cors");

const Person = require("./models/person");

// eslint-disable-next-line no-unused-vars
morgan.token("content", (req, res) => JSON.stringify(req.body));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.content(req, res),
    ].join(" ")
  )
);
app.use(express.static("build"));

app.post("/api/persons", (req, res, next) => {
  const { body } = req;

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

    person
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  }
});

app.put("/api/persons/:id", (req, res, next) => {
  const { body } = req;
  const query = { name: body.name };
  Person.findOneAndUpdate(
    query,
    { number: body.number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({
          error: "this person has already been deleted",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/info", (req, res) => {
  const current = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people on ${current}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(204).end;
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT);
console.log(`server running on port ${PORT}`);
