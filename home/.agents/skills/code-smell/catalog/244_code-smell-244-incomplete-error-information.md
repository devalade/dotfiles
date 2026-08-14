# Code Smell 244 - Incomplete Error information

**TL;DR:** Help yourself and others with correction information

## Problems

- Debugging and maintenance challenge.

- Fail Fast Principle violation

- Debugging complex situations.

## Solutions

- Add all the relevant information to solve the solution

## Sample Code

##### Wrong

```
VALID_COLUMNS = ['name', 'gender', 'email']

def process_API_information(data):
    invalid_columns = []
    for column in data.keys():
        if column not in VALID_COLUMNS:
            invalid_columns.append(column)

    assert not invalid_columns, "Invalid columns detected."
    # No details were provided about which columns are invalid

data = {'name': 'John', 'gender': 'Pangender',
        'age': 47, 'email': 'john@example.com'}
process_API_information(data)

```

##### Right

```
VALID_COLUMNS = ['name', 'gender', 'email']

def process_API_information(data):
    invalid_columns = [
        column for column in data.keys() if column not in VALID_COLUMNS
    ]

    if invalid_columns:
        raise ValueError(
            f"Invalid columns detected: {', '.join(invalid_columns)}"
        )  # Shows WHICH columns are invalid

data = {'name': 'John', 'gender': 'Pangender',
        'age': 47, 'email': 'john@example.com'}
process_API_information(data)

```

## Detection

[X] Semi-Automatic

This is a semantic smell. You can warn the developers on error texts that do not include variables.

## Tags

- Errors

## Conclusion

You need to always think about how to help your end users.

It might be yourself.

## Relations

[https://maximilianocontieri.com/code-smell-104-assert-true](https://maximilianocontieri.com/code-smell-104-assert-true)
[https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy](https://maximilianocontieri.com/code-smell-97-error-messages-without-empathy)