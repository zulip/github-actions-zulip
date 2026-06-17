// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintConfigXo from "eslint-config-xo";

export default defineConfig(
  globalIgnores(["dist/", "package-lock.json"]),
  eslintConfigXo(),
  eslintConfigPrettier,
);
