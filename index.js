const express = require("express");
const cors = require("cors");
const {
  createNode,
  generatePages,
  generateComponents,
  generateElements,
} = require("./generator");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// ROOT NODE (app)
const rootNode = createNode({
  label: "Enterprise App",
  type: "app",
  depth: 0,
  hasChild: true,
});

// endpoint to get children of any node
const cache = new Map(); // optional caching

app.get("/nodes/:id/children", (req, res) => {
  const { type } = req.query; // frontend tells us what type of node it is
  const cacheKey = `${req.params.id}-${type}`;

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  let children = [];

  switch (type) {
    case "app":
      children = generatePages(); // generate page nodes
      break;

    case "page":
      children = generateComponents(); // generate components
      break;

    case "component":
      children = generateElements(); // generate elements
      break;

    default:
      children = []; // elements have no children
  }

  cache.set(cacheKey, children);

  // simulate network delay
  setTimeout(() => res.json(children), Math.floor(Math.random() * 300) + 100);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
