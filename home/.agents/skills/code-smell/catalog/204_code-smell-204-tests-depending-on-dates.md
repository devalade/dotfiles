# Code Smell 204 - Tests Depending on Dates

**TL;DR:** Tests must be in full control and you can't manage time.

## Problems

- Fragile Tests

- CI/CD Breaks

## Solutions

- Tests should be always in full environmental control.

- Create a time source

## Sample Code

##### Wrong

```
class DateTest {
    @Test
    void testNoFeatureFlagsAfterFixedDate() {
        LocalDate fixedDate = LocalDate.of(2023, 4, 4);
        LocalDate currentDate = LocalDate.now();
        Assertions.assertTrue(currentDate.isBefore(fixedDate) || !featureFlag.isOn());
    }
}

```

##### Right

```
class DateTest {
    @Test
    void testNoFeatureFlags() {
        Assertions.assertFalse(featureFlag.isOn());
    }
}

```

## Detection

[X] Semi-Automatic

We can check assertions based on time on our tests.

## Tags

- Testing

## Conclusion

Proceed with caution with tests and dates.

They are often a cause of mistakes.

## Relations

[https://maximilianocontieri.com/code-smell-52-fragile-tests](https://maximilianocontieri.com/code-smell-52-fragile-tests)