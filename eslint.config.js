// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigXo from "eslint-config-xo";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig(
  globalIgnores(["dist/", "package-lock.json"]),
  eslintConfigXo(),
  eslintPluginPrettierRecommended,
);
