var sharedPrettierConfig = require("eslint-config-turbocharge/prettier");

module.exports = {
  ...sharedPrettierConfig,
  plugins: ["prettier-plugin-gherkin"],
};
