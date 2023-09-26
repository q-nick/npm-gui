Feature: Explorer

  Background:
    Given Prepare test project
    And Use manager "npm"

  Scenario: pwd result when given path is undefined
    When I explore path: ""
    Then Result match:
      | { "ls": [{ "isDirectory": false, "isProject": false, "name": ".editorconfig" }] } |

  Scenario: pwd result when given path is given
    When I explore path: "feature/steps/test-project-dirs/explorer-pwd-result-when-given-path-is-given"
    Then Result match:
      | { "ls": [{ "isDirectory": false, "isProject": true, "name": "package.json" }] } |
