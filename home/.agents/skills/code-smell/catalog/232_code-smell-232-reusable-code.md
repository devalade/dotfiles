# Code Smell 232 - Reusable Code

Don't Repeat Yourself. Don't Repeat Yourself

**TL;DR:** You can find missing abstractions by looking at repeated code

## Problems

- DRY principle violation

- Maintainability

- Ripple Effect

## Solutions

- Create the repeated code

- Introduce an abstraction

- Replace the references and point to the new abstraction

- Remove the duplication

## Exceptions

The abstraction must have a dependency correspondence on the Bijection

## Sample Code

##### Wrong

```
def calculate_area(length, width):
    return length * width

def calculate_volume(length, width, height):
    return length * width * height

```

##### Right

```
def calculate_area(length, width):
    return length * width

def calculate_volume(length, width, height):
    base_area = calculate_area(length, width)
    return base_area * height

```

## Detection

[X] Semi-Automatic

Some linters can find repeated code patterns.

## Tags

- Bloaters

## Conclusion

Repeated code is a problem and a hint for a missing abstraction.

Remember you don't need to avoid copying and pasting.

You must explicitly write the repeated code and remove the duplication by introducing an abstraction.

Avoiding the cut and paste is a shortcut and a symptom of premature optimization.

## Relations

[https://maximilianocontieri.com/code-smell-46-repeated-code](https://maximilianocontieri.com/code-smell-46-repeated-code)
[https://maximilianocontieri.com/code-smell-182-over-generalization](https://maximilianocontieri.com/code-smell-182-over-generalization)