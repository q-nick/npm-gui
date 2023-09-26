Feature: Reinstall project using different manager

  Background:
    Given Prepare test project

  Scenario Outline: Empty project <manager>
    Given Use manager "<manager>"

    When Install project using "<forceManager>"
    Then Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager | forceManager |
      | npm     | pnpm         |
      | pnpm    | yarn         |
      | yarn    | npm          |

  Scenario Outline: Not empty project <manager>
    Given Use manager "<manager>"

    When Add dependencies to package.json:
      | npm-gui-tests | ^1.0.0 |
    And Install project using "<forceManager>"
    Then Fast dependencies should be:
      | { "manager": "<forceManager>", "name": "npm-gui-tests", "required": "^1.0.0", "type": "prod" } |
    And Full dependencies should be:
      | { "manager": "<forceManager>", "name": "npm-gui-tests", "required": "^1.0.0", "installed": "1.1.1", "latest": "2.1.1", "wanted": null, "type": "prod" } |

    Examples:
      | manager | forceManager |
      | npm     | pnpm         |
      | pnpm    | yarn         |
      | yarn    | npm          |
