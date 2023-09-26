Feature: Available manahers

  Background:
    Given Prepare test project

  Scenario: simple check
    When I check available managers
    Then Result match:
      | { "npm": true, "yarn": true, "pnpm": true } |
