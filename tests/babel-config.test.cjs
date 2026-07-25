const assert = require("node:assert/strict");
const test = require("node:test");

const createBabelConfig = require("../babel.config.js");

test("uses Expo JSX runtime instead of the unused CSS interop runtime", () => {
  const config = createBabelConfig({ cache: () => undefined });

  assert.deepEqual(config.presets, ["babel-preset-expo"]);
});
