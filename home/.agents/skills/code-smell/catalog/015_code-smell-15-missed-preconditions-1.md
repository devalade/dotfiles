# Code Smell 15 - Missed Preconditions

Assertions, Preconditions, Postconditions and invariants are our allies to avoid invalid objects. Avoiding them leads to hard-to-find errors.

**TL;DR:** If you turn off your assertions just in production your phone will ring at late hours.

## Problems

- Consistency
- Contract breaking
- Hard to debug
- Bad cohesion

## Solutions

- Create strong preconditions
- Raise exceptions
- Fail Fast
- Defensive Programming

## Sample Code

##### Wrong

```
class Date:
  def __init__(self, day, month, year):
    self.day = day
    self.month = month
    self.year = year

  def setMonth(self, month):
    self.month = month

startDate = Date(3, 11, 2020)
#OK

startDate = Date(31, 11, 2020)
#Should fail

startDate.setMonth(13)
#Should fail

```

##### Right

```
class Date:
  def __init__(self, day, month, year):
      if month > 12:
        raise Exception("Month should not exceed 12")
    #
    # etc ...

    self._day = day
    self._month = month
    self._year = year

startDate = Date(3, 11, 2020)
#OK

startDate = Date(31, 11, 2020)
#fails

startDate.setMonth(13)
#fails since invariant makes object immutable

```

## Detection

- It's difficult to find missing preconditions, as long with assertions and invariants.

## Tags

- Consistency

## Conclusion

Always be explicit on object integrity.

Turn on production assertions.

Even if it brings performance penalties.

Data and object corruption is harder to find.

Fail fast is a blessing.

https://maximilianocontieri.com/fail-fast

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)