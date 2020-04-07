const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ errors: 'Invalid ID' });
  }

  return next();
}

app.use('/repositories/:id', validateId);

const repositories = [];

function repoIndex(id) {
  return repositories.findIndex(repository => repository.id === id);
}

app.get("/repositories", (_, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repoIndex(id);

  console.log(repositoryIndex);

  if (repositoryIndex < 0) {
    return response.status(400).json({ errors: 'Repository not found' });
  }

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repoIndex(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ errors: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(400).json({ errors: 'Repository not found' })
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;