const crypto = require("crypto");

// helper: random integer
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// helper: probability
function chance(percent) {
  return Math.random() * 100 < percent;
}

// create node in YOUR format
function createNode({ label, type, depth, hasChild }) {
  return {
    nodeLabel: label,
    nodeValue: null,
    nodeType: type,
    isCollapse: false,
    hasChild,
    children: null,
    events: type === "element" ? ["click", "hover", "change"] : null,
    id: crypto.randomUUID(),
    depth,
  };
}

// generate pages (level 1)
function generatePages() {
  const pageCount = randomInt(50, 120);
  return Array.from({ length: pageCount }, (_, i) =>
    createNode({
      label: `Page ${i + 1}`,
      type: "page",
      depth: 1,
      hasChild: true,
    })
  );
}

// generate components (level 2)
function generateComponents() {
  const componentCount = randomInt(10, 100);

  return Array.from({ length: componentCount }, (_, i) => {
    const hasElements = !chance(35); // 35% chance to have NO elements
    return createNode({
      label: `Component ${i + 1}`,
      type: "component",
      depth: 2,
      hasChild: hasElements,
    });
  });
}

// generate elements (level 3)
function generateElements() {
  const elementCount = randomInt(1, 50);
  return Array.from({ length: elementCount }, (_, i) =>
    createNode({
      label: `Element ${i + 1}`,
      type: "element",
      depth: 3,
      hasChild: false,
    })
  );
}

module.exports = {
  createNode,
  generatePages,
  generateComponents,
  generateElements,
};
