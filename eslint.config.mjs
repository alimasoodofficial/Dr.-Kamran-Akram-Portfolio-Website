import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Extend Next.js defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom overrides
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",   // ✅ disables the "Unexpected any" error
      "no-unused-vars": "warn",                      // example: only warn, not error
      "react-hooks/exhaustive-deps": "off",          // disable hook deps rule if too strict
    },
  },
];
