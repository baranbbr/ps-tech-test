Feature: User List
  As a user
  I want to view a list of users with their achievement levels
  So that I can see user progress

  Scenario: View all users
    Given I am on the user list page
    Then I should see a list of users
    And each user should display their name and level

  Scenario: Search for a user
    Given I am on the user list page
    When I enter "John" in the search field
    Then I should see users with "John" in their name
    And I should not see users without "John" in their name

  Scenario: View user details
    Given I am on the user list page
    When I click on a user
    Then I should be taken to the user details page
    And I should see detailed information about the user
