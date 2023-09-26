Feature: Remove dependencies

  Background:
    Given Prepare test project

  Scenario Outline: Uninstalled invalid name <manager>
    Given Use manager "<manager>"
    And Add dependencies to package.json:
      | npm-gui-tests | ^1.0.0 |

    When Remove "prod" dependency "sdmvladbf3"
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^1.0.0","type":"prod"} |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^1.0.0","installed":<installed>,"latest":<latest>,"wanted":null,"type":"prod"} |

    Examples:
      | manager | installed | latest  |
      | npm     | "1.1.1"   | "2.1.1" |
      | pnpm    | null      | null    |
      | yarn    | null      | null    |

  Scenario Outline: Uninstalled valid name <manager>
    Given Use manager "<manager>"
    And Add dependencies to package.json:
      | npm-gui-tests | ^1.0.0 |

    When Remove "prod" dependency "npm-gui-tests"
    Then Result is not error
    And Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario Outline: Installed invalid name <manager>
    Given Use manager "<manager>"
    And Add dependencies to package.json:
      | npm-gui-tests | ^1.0.0 |
    And Install project using "<manager>"

    When Remove "prod" dependency "sdmvladbf3"
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^1.0.0","type":"prod"} |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^1.0.0","installed":"1.1.1","latest":"2.1.1","wanted":null,"type":"prod"} |

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario Outline: Installed valid name <manager>
    Given Use manager "<manager>"
    And Add dependencies to package.json:
      | npm-gui-tests | ^1.0.0 |
    And Install project using "<manager>"

    When Remove "prod" dependency "npm-gui-tests"
    Then Result is not error
    And Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |
