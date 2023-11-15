/** @type {import("prettier").Config} */
const config = {
    singleQuote: true,
    printWidth: 150,
    proseWrap: "always",
    tabWidth: 4,
    useTabs: false,
    trailingComma: "none",
    bracketSpacing: true,
    jsxBracketSameLine: false,
    semi: false,
    plugins: ["prettier-plugin-tailwindcss"],
}
export default config
