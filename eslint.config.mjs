import tsProcessor from "./tools/eslint/ts-processor.cjs"

const baseConfig = {
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
}

export default [
  {
    ignores: ["**/node_modules/**", ".next/**", "dist/**", "**/*.d.ts"],
  },
  {
    ...baseConfig,
    files: ["**/*.{js,jsx,mjs,cjs}"],
  },
  {
    ...baseConfig,
    files: ["**/*.{ts,tsx}"],
    processor: tsProcessor,
  },
]
