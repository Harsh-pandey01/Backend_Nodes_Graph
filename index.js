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
const cache = new Map();

app.get("/", (req, res) => {
  res.json({
    message: "Nodal Backend API",
    description:
      "This API dynamically generates enterprise-level hierarchical data (App → Pages → Components → Elements). Data is lazy-loaded and generated on demand.",
    howToUse: {
      step1: "Start from the App level",
      endpoint: "/nodes/root/children?type=app",
      description: "Returns all Pages inside the App",
    },
    routes: [
      {
        level: "App → Pages",
        method: "GET",
        endpoint: "/nodes/root/children?type=app",
      },
      {
        level: "Page → Components",
        method: "GET",
        endpoint: "/nodes/:pageId/children?type=page",
        example: "/nodes/page-1/children?type=page",
      },
      {
        level: "Component → Elements",
        method: "GET",
        endpoint: "/nodes/:componentId/children?type=component",
        example: "/nodes/comp-10/children?type=component",
      },
    ],
    notes: [
      "Children are lazy-loaded (generated only when requested)",
      "Some components may return an empty array (no elements)",
      "No database is used — data is generated in-memory",
      "Designed for enterprise-scale testing",
    ],
  });
});

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
