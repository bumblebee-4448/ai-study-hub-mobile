import assert from "node:assert/strict";
import test from "node:test";

const themeResolver = await import("./themeResolver.ts");

test("resolves explicit light and dark preferences ahead of the system scheme", () => {
  assert.equal(themeResolver.resolveThemePreference("light", "dark"), "light");
  assert.equal(themeResolver.resolveThemePreference("dark", "light"), "dark");
});

test("resolves system preference from the device scheme with light fallback", () => {
  assert.equal(themeResolver.resolveThemePreference("system", "dark"), "dark");
  assert.equal(themeResolver.resolveThemePreference("system", "light"), "light");
  assert.equal(themeResolver.resolveThemePreference("system", null), "light");
});

test("returns high contrast app colors for both schemes", () => {
  const light = themeResolver.getAppTheme("light");
  const dark = themeResolver.getAppTheme("dark");

  assert.equal(light.scheme, "light");
  assert.equal(dark.scheme, "dark");
  assert.notEqual(light.colors.background, dark.colors.background);
  assert.notEqual(light.colors.surface, dark.colors.surface);
  assert.notEqual(light.colors.text, dark.colors.text);
  assert.match(dark.colors.background, /^#[0-9a-f]{6}$/i);
});
