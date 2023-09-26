Feature: Add multiple dependencies

  Background:
    Given Prepare test project

  Scenario Outline: Incorrect dependencies name using <manager>
    Given Use manager "<manager>"

    When Add dependencies:
      | sdmvladbf3 | v1.0.0 |
      | fasdf2     | v1.0.0 |
    Then Result is error
    And Fast dependencies should be empty
    And Full dependencies should be empty

    Examples:
      | manager |
      | npm     |
      | pnpm    |
      | yarn    |

  Scenario Outline: Incorrect dependencies version using <manager>
    Given Use manager "<manager>"

    When Add dependencies:
      | npm-gui-tests          | 3.0.0   |
      | @npm-gui/npm-gui-tests | v15.0.0 |
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

    When Add dependencies:
      | npm-gui-tests          |
      | @npm-gui/npm-gui-tests |
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredB>","type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredA>","type":"dev"}          |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredB>","installed":"2.0.1","latest":null,"wanted":null,"type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredA>","installed":"2.1.1","latest":null,"wanted":null,"type":"dev"}          |

    Examples:
      | manager | requiredA | requiredB |
      | npm     | ^2.1.1    | ^2.0.1    |
      | pnpm    | ^2.1.1    | ^2.0.1    |
      | yarn    | ^2.1.1    | ^2.0.1    |

  Scenario: Correct dependency and version using <manager>
    Given Use manager "<manager>"

    When Add dependencies:
      | npm-gui-tests          | ^1.0.0 |
      | @npm-gui/npm-gui-tests | ^1.0.0 |
    Then Result is not error
    And Fast dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredB>","type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredA>","type":"dev"}          |
    And Full dependencies should be:
      | {"manager":"<manager>","name":"@npm-gui/npm-gui-tests","required":"<requiredB>","installed":"1.0.1","latest":"2.0.1","wanted":null,"type":"dev"} |
      | {"manager":"<manager>","name":"npm-gui-tests","required":"<requiredA>","installed":"1.1.1","latest":"2.1.1","wanted":null,"type":"dev"}          |

    Examples:
      | manager | requiredA | requiredB |
      | npm     | ^1.1.1    | ^1.0.1    |
      | pnpm    | ^1.0.0    | ^1.0.0    |
      | yarn    | ^1.0.0    | ^1.0.0    |
