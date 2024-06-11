const globals = require("globals");
const pluginReactConfig = require("eslint-plugin-react/configs/recommended.js");

module.exports = [
  {
    files: ["*.js", "*.jsx"],
    languageOptions: { globals: globals.browser },
    plugins: {
      react: pluginReactConfig,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];