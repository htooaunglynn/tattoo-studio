import nextVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = [
  ...nextVitals,
  {
    ignores: [".next/**", "playwright-report/**", "test-results/**"],
  },
]

export default eslintConfig
