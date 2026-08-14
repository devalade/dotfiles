# Code Smell 211 - Tab over Spaces

**TL;DR:** Don't use Tabs. It is not a "personal style decision"

## Problems

- Readability

- Compilation errors in some languages

- Mixed Standards

## Solutions

- Use spaces. Always.

- Use automatic tools to prevent tabs in the code.

## Sample Code

##### Wrong

```
def calculate_average(numbers):
    total = 0
    count = 0
        for number in numbers:
    total += number
            count += 1
        average = total / count
    return average

numbers = [1, 2, 3, 4, 5]
print("The average is:", calculate_average(numbers))

```

##### Right

```
def calculate_average(numbers):
    total = 0
    count = 0
    for number in numbers:
        total += number
        count += 1
    average = total / count
    return average

numbers = [1, 2, 3, 4, 5]
print("The average is:", calculate_average(numbers))

```

## Detection

[X] Automatic

We can enforce a policy to avoid tabs.

## Tags

- Standards

## Conclusion

Bad indentation can make the code difficult to read and understand and can cause errors if the indentation is not consistent throughout the code.

Using spaces for indentation is generally recommended for consistency, readability, and accessibility.

## Relations

[https://maximilianocontieri.com/code-smell-164-mixed-indentations](https://maximilianocontieri.com/code-smell-164-mixed-indentations)
[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)