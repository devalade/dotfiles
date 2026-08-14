# Code Smell 275 - Missing Test Wrong Path

try-catch

**TL;DR:** Ensure you fail the test when no exception is thrown in invalid conditions.

## Problems

- Silent faulty tests
- Missing failure condition
- Poor error validation
- Unclear test outcome
- Skipped test logic

## Solutions

- Add failure assertion
- Explicit exception validation
- Test invalid actions
- Catch specific errors
- Check all your test paths
- Use mutation testing

Context

When writing tests you expect certain cases to throw exceptions.

If you forget to add a fail condition when no exception is thrown, your test might pass silently.

If breaking some contract doesn't raise an exception, the test will still pass without you noticing the issue.

Always include a failure condition to ensure the test fails when the expected exception isn't thrown.

## Sample Code

##### Wrong

```
// Test: firing at an already hit position should not be allowed

const game = new Battleship();
game.fireAt("A3");
// First hit

try {
    game.fireAt("A3");
     // Firing at the same spot
} catch (e) {
    console.assert(e.message === 'Position already hit.',
     'The error message should indicate the position is already hit.');
}

```

##### Right

```
// Test: firing at an already hit position should not be allowed

const game = new Battleship();
game.fireAt("A3");
// First hit

try {
    game.fireAt("A3");
     // Firing at the same spot

     // THIS LINE IS IMPORTANT
     cnsole.assert(false,
        'An exception should have been thrown' .
        ' for firing at the same position.');
     // THIS LINE IS IMPORTANT

} catch (e) {
    console.assert(e.message === 'Position already hit.',
     'The error message should indicate the position is already hit.');
}

```

## Detection

[X] Semi-Automatic

You can detect this smell by looking for try-catch blocks without a failure condition after an action that should throw an exception.

Test cases expecting exceptions should always include assert(false) right after the invalid action.

## Tags

- Testing

## Conclusion

You must include a fail condition when testing invalid actions like firing at the same position in Battleship.

This ensures the test fails if no exception is thrown, preventing silent errors. Always validate the error message and ensure your tests catch valid and invalid behaviors.

## Relations

[https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases](https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases)
[https://maximilianocontieri.com/code-smell-80-nested-trycatch](https://maximilianocontieri.com/code-smell-80-nested-trycatch)
[https://maximilianocontieri.com/code-smell-132-exception-try-too-broad](https://maximilianocontieri.com/code-smell-132-exception-try-too-broad)