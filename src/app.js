const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateUuid = (request, response, next) => {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(400).json({ error: "Invalid repository ID" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository);
  return response.json(newRepository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories[index].title = title;
  repositories[index].url = url;
  repositories[index].techs = techs;

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateUuid, (request, response) => {
  const {id} = request.params;
  
  const index = repositories.findIndex(repository => repository.id === id);
  if (index < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  
  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
