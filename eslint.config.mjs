export default [
  {
    ignores: ["**/*.ts", "**/*.tsx", "**/node_modules/**", ".next/**"],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
]
