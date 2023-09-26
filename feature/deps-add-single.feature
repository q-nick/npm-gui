Feature: Add single dependency

  Background:
    Given Prepare test project

  Scenario Outline: Incorrect dependency name using <manager>
    Given Use manager "<manager>"

    When Add dependency "sdmvladbf3" version "v1.0.0"
    Then Result is error
    And Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario Outline: Incorrect dependency version using <manager>
    Given Use manager "<manager>"

    When Add dependency "npm-gui-tests" version "^3.1.1"
    Then Result is error

    When Add dependency "@npm-gui/npm-gui-tests" version "^3.1.1"
    Then Result is error
    And Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario Outline: Correct dependency no version using <manager>
    Given Use manager "<manager>"

    When Add "dev" dependency "npm-gui-tests"
    Then Result is not error

    When Add "dev" dependency "@npm-gui/npm-gui-tests"
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"^2.0.1","type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^2.1.1","type":"dev"}          |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"^2.0.1","installed":"2.0.1","latest":null,"wanted":null,"type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"^2.1.1","installed":"2.1.1","latest":null,"wanted":null,"type":"dev"}          |

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario: Correct dependency and version using <manager>
    Given Use manager "<manager>"

    When Add dependency "npm-gui-tests" version "^1.0.0"
    Then Result is not error

    When Add dependency "@npm-gui/npm-gui-tests" version "^1.0.0"
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredA>","type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredB>","type":"dev"}          |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredA>","installed":"1.0.1","latest":"2.0.1","wanted":null,"type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredB>","installed":"1.1.1","latest":"2.1.1","wanted":null,"type":"dev"}          |

    Examples:
      | manager | requiredA | requiredB |
      | npm     | ^1.0.1    | ^1.1.1    |
      | pnpm    | ^1.0.0    | ^1.0.0    |
      | yarn    | ^1.0.0    | ^1.0.0    |
