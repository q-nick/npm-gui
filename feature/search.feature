Feature: Search dependencies

  Scenario: Search for: npm-gui-tests
    When I search for: "npm-gui-tests"
    Then Result match:
      | { "name": "npm-gui-tests",  "version": "2.1.1", "repository": "https://github.com/q-nick/npm-gui-tests" } |
