import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      ".next/**",
      "dist/**",
      "node_modules/**",
      "src/**",
      "vite.config.ts",
      "*.tsbuildinfo"
    ]
  }
];

export default config;
