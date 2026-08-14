# Code Smell 179 - Known Bugs

**TL;DR:** Don't track bugs. Fix them.

## Problems

- Hard to-track lists

- Technical Debt

- Functional Debt

## Solutions

- Stop calling it a Bug

- Reproduce the Defect.

- Cover the scenario with automation

- Make the most straightforward fix (even hardcoding solutions)

- Refactor

Welcome to TDD!

## Sample Code

##### Wrong

```
<?

function divide($numerator, $denominator) {
  return $numerator / $denominator;
  // FIXME denominator value might be 0
  // TODO Rename function
}

```

##### Right

```
<?

function integerDivide($numerator, $denominator) {
  if (denominator == 0) {
    throw new DivideByZero();
  }
  return $numerator / $denominator;
}

// we pay our debts

```

## Detection

[X] Automatic

We need to avoid creating bugs and issues.

## Tags

- Technical Debt

## Conclusion

We need to discourage bugs and issue trackers on the engineering side.

Of course, customers need to track their findings and we need to address them ASAP.

## Relations

[https://maximilianocontieri.com/code-smell-148-todos](https://maximilianocontieri.com/code-smell-148-todos)