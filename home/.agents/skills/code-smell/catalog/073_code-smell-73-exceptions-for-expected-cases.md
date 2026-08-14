# Code Smell 73 - Exceptions for Expected Cases

Exceptions are handy Gotos and flags. Let's abuse them.

**TL;DR:** Do not use exceptions for flow control.

## Problems

- Readability

- Principle of least astonishment Violation.

## Solutions

- Use Exceptions just for unexpected situations.

- Exceptions handle contract violations. Read the contract.

## Sample Code

##### Wrong

```
try {
    for (int i = 0;; i++)
        array[i]++;
    } catch (ArrayIndexOutOfBoundsException e) {}

//Endless loop without end condition

```

##### Right

```
for (int index = 0; index < array.length; index++)
        array[index]++;

//index < array.length breaks execution

```

## Detection

This is a semantic smell. Unless we use machine learning linters it will be very difficult to find the mistakes.

## Tags

- Readability

## Conclusion

Exceptions are handy, and we should definitively use them instead of returning codes.

The boundary between correct usage and wrong usage is blur like so many design principles.

## Relations

[https://maximilianocontieri.com/code-smell-72-return-codes](https://maximilianocontieri.com/code-smell-72-return-codes)
[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)