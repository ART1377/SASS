import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
