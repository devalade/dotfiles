# Code Smell 227 - Cowboy Coding

**TL;DR:** Write code as a team programmer

## Problems

- Readability

- Unreliable code

- People Management Issues

- Lack of coordination

## Solutions

- Write professional code

- Use declarative non-cryptic names

## Exceptions

- Very small personal projects

## Sample Code

##### Wrong

```
# Very simple example
# Compute the sum of two numbers without any structure or best practices.

num1 = input("Enter the first number: ")
num2 = input("Enter the second number: ")

# WARNNING!!!! Don't remove the line below !!!!!
# (Unpleasant comment)

res = num1 + num2  # (No data type checking or error handling)

print("The sum is: " + result)  # (No validation or formatting)

# (No good names, no functions, no error handling, no testing, no version control, and no structure.)

```

##### Right

```
def add_numbers():
    try:
        firstAddend = float(input("Enter the first number: "))
        secondAddend = float(input("Enter the second number: "))
        sum = firstAddend + secondAddend
        return sum
    except ValueError:
        print("Invalid input. Please enter valid numbers.")
        return None

def main():
    sum = add_numbers()
    if sum is not None:
        print("The sum is: {:.2f}".format(sum))

if __name__ == "__main__":
    main()

```

## Detection

[X] Manual

You can set environmental rules to prevent these coding practices and enforce team building.

## Tags

- Declarative

## Conclusion

Software development is teamwork.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)
[https://maximilianocontieri.com/code-smell-105-comedian-methods](https://maximilianocontieri.com/code-smell-105-comedian-methods)