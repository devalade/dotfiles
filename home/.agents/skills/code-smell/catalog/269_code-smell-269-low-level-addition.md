# Code Smell 269 - Low-Level Addition

sum()

**TL;DR:** Ditch the Loops: Write Cleaner Code with Declarative Style

## Problems

- Verbose logic
- Repeated patterns
- Readability
- Maintainability

## Solutions

- Remove loops
- Simplify logic
- Write declarative and high-level code

## Sample Code

##### Wrong

```
transaction_values = [10.0, -5.21, 101.32, 1.11, -0.38]
balance = 0
for transaction_value in transaction_values:
    balance += transaction_value

```

##### Right

```
transactions_values = [10.0, -5.21, 101.32, 1.11, -0.38]
balance = sum(transactions_values)

```

## Detection

[X] Semi-Automatic

You can detect this smell when you see explicit loops accumulating a result, especially in simple operations like summing values.

## Tags

- Declarative

## Conclusion

Favoring declarative functions like sum() improves readability and reduces potential errors.

You reduce the need for manual loops and make it easier to maintain. It shows exactly what the code is doing with minimal syntax and clutter.

## Relations

[https://maximilianocontieri.com/code-smell-53-explicit-iteration](https://maximilianocontieri.com/code-smell-53-explicit-iteration)
[https://maximilianocontieri.com/code-smell-123-mixed-what-and-how](https://maximilianocontieri.com/code-smell-123-mixed-what-and-how)