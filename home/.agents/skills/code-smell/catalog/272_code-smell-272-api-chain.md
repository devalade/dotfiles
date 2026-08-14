# Code Smell 272 - API Chain

POST

**TL;DR:** Use primitive steps to verify API behavior instead of direct requests.

## Problems

- Unnecessary API calls
- Slow test performance
- Overcomplicated validations
- Fragile tests
- Slow feedback loops
- Maintainability
- Misleading test results

## Solutions

- Test primitive outcomes
- Validate responses directly
- Avoid extra API steps
- Simplify test logic

## Sample Code

##### Wrong

```
Feature: Movie Management
  Scenario: Create a movie and verify
    When I send a POST request to "/movies" with the following data:
      | title   | director     | year |
      | Klendathu | Christopher Nolan | 2010 |
    When I send a GET request to "/movies/Klendathu"
    Then the response status should be 200
    And the response should contain:
      | title   | director     | year |
      | Klendathu | Christopher Nolan | 2010 |

```

##### Right

```
Feature: Movie Management
  Scenario: Create a movie and verify
    When I create a movie with the following details:
      | title   | director     | year |
      | Klendathu  | Christopher Nolan | 2010 |
    Then the movie "Klendathu" should exist in the system
    ## This is a low level existance postcondition
    ## Without reliyng on a GET request

```

## Detection

[X] Semi-Automatic

You can detect this smell when you see test steps that use a GET request to verify the success of a POST.

## Tags

- Testing

## Conclusion

Focus your acceptance tests on the direct results of operations like POST.

Avoid making a GET request afterward to verify what you already know.

## Relations

[https://maximilianocontieri.com/code-smell-259-testing-with-external-resources](https://maximilianocontieri.com/code-smell-259-testing-with-external-resources)
[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)
[https://maximilianocontieri.com/code-smell-52-fragile-tests](https://maximilianocontieri.com/code-smell-52-fragile-tests)