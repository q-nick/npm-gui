Feature: Info

  Background:
    Given Prepare test project

  Scenario: simple check
    When I request info
    Then Result is not error
