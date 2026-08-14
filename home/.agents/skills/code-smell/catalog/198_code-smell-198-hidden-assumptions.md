# Code Smell 198 - Hidden Assumptions

**TL;DR:** Keep your code explicit

## Problems

- Coupling

- Fail Fast Principle violation

- Bijection Fault

## Solutions

- Be declarative and explicit

- Don't oversimplify

## Sample Code

##### Wrong

```
tenCentimeters = 10
tenInches = 10

tenCentimeters + tenInches
# 20
# this error is based on the hidden assumption of a unit (any)
# and caused the Mars Climate Orbiter failure

```

##### Right

```
class Unit:
    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol

class Measure:
    def __init__(self, scalar, unit):
        self.scalar = scalar
        self.unit = unit

    def __str__(self):
        return f"{self.scalar} {self.unit.symbol}"

centimetersUnit = Unit("centimeters", "cm")
inchesUnit = Unit("inches", "in")

tencCentimeters = Measure(10, centimeters)
tenInches = Measure(10, inches)

tenCentimeters + tenInches
# error until we introduce a conversion factor
# in this case the conversion is constant
# inches = centimeters / 2.54

```

## Detection

[X] Manual

This is a design smell

## Tags

- Coupling

## Conclusion

Hidden assumptions can be difficult to identify and can lead to bugs, security vulnerabilities, and usability issues.

To mitigate these risks, software developers should be aware of their assumptions and biases.

Developers also need to engage with users to understand their needs and expectations.

They must test their software in various scenarios to uncover hidden assumptions and edge cases.

## Relations

[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)