import { defineConfig } from "oxfmt";

export default defineConfig({
  overrides: [{ files: ["*.{json,jsonc}"], options: { trailingComma: "none" } }],
});
