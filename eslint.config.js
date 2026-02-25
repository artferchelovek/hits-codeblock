import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin, { rules } from "eslint-plugin-import";
import perfectionisPlugin from "eslint-plugin-perfectionist";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { perfectionist: perfectionisPlugin, import: importPlugin },
    rules: {
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"], // разрешает только top-level type import
      "import/newline-after-import": ["error", { count: 1 }], // пустая строка после импортов

      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
          groups: [
            "side-effect",
            { newlinesBetween: 1 },
            "builtin",
            { newlinesBetween: 1 },
            "react",
            { newlinesBetween: 0 },
            "external",
            { newlinesBetween: 1 },
            "internal",
            { newlinesBetween: "ignore" },
            "parent",
            { newlinesBetween: "ignore" },
            "sibling",
            { newlinesBetween: "ignore" },
            "index",
            { newlinesBetween: 1 },
            "import",
            { newlinesBetween: 1 },
            "type-react",
            { newlinesBetween: 0 },
            "type-external",
            { newlinesBetween: 1 },
            "type-internal",
            { newlinesBetween: "ignore" },
            "type-parent",
            { newlinesBetween: "ignore" },
            "type-sibling",
            { newlinesBetween: "ignore" },
            "type-index",
            { newlinesBetween: 0 },
            "type-import",
            { newlinesBetween: 1 },
            "side-effect-style",
            { newlinesBetween: 0 },
            "style",
          ],
          customGroups: [
            {
              groupName: "type-react",
              elementNamePattern: ["^react$", "^react-.*"],
              selector: "type",
            },
            {
              groupName: "react",
              elementNamePattern: ["^react$", "^react-.*"],
            },
          ],
          newlinesBetween: 1, // пустая строка между группами
          internalPattern: ["^app/.+"], // петтерны внутренних путей
        },
      ],
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
