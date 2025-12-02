import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  {
    ignores: [
      "dist/*",
      ".cache/**/*",
      "public/**/*",
      "node_modules/**/*",
      "*.esm.js",
      ".next/**/*",
      "app/*",
      "components/*",
      "types/*"
    ]
  },
  {
    plugins: { "better-tailwindcss": betterTailwindcss },
    rules: {
      // React & Next.js best practices
      "react/jsx-key": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",

      // Tailwind CSS best practices
      "better-tailwindcss/sort-classes": "warn",
      "better-tailwindcss/no-conflicting-classes": "warn",
      "better-tailwindcss/no-duplicate-classes": "warn",

      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // JS best practices
      "no-console": ["warn", { allow: ["warn", "error"] }]
    },
    settings: {
      next: { rootDir: ["./src"] },
      "better-tailwindcss": { entryPoint: "src/styles/globals.css" }
    }
  }
];

export default eslintConfig;
