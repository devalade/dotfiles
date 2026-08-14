# Code Smell 186 - Hardcoded Business Conditions

**TL;DR:** Don't add hard business rules to your code.

## Problems

- Open / Closed Principle Violation

- Hardcoding

- Testability

## Solutions

- Reify the condition.

- Create configuration options and set the exception on the configuration behavior.

- Don't use Settings/Configs.

## Sample Code

##### Wrong

```
if (currentExposure > 0.15 && customer != "Alameda") {
  // Be extra careful not to liquidate
  liquidatePosition();
}

```

##### Right

```
  customer.liquidatePositionIfNecessary(0.15);

  // This follows the Tell, Don't ask principle

```

## Detection

[X] Semi-Automatic

We can search for primary hardcoded conditions (related to primitive types).

We might have more false positives than actual problems.

## Tags

- Hardcoding

## Conclusion

If you make code reviews, pay special attention to this kind of hard coding.

## Relations

[https://maximilianocontieri.com/code-smell-133-hardcoded-if-conditions](https://maximilianocontieri.com/code-smell-133-hardcoded-if-conditions)
[https://maximilianocontieri.com/code-smell-29-settingsconfigs](https://maximilianocontieri.com/code-smell-29-settingsconfigs)