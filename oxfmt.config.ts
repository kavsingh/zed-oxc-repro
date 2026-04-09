import { defineConfig } from "oxfmt";

export default defineConfig({
	useTabs: true,
	overrides: [{ files: ["*.{json,jsonc}"], options: { trailingComma: "none" } }],
});
