# Code Smell 245 - exec() and eval()

**TL;DR:** Don't use metaprogramming. It is not that cool

## Problems

- Security

- Limited Control

## Solutions

- Use direct calls

- Wrap the execution in a primitive and controlled command

- Sanitize it

## Sample Code

##### Wrong

```
def calculate(mathOperand, firstArgument, secondArgument):
    return eval(f'{firstArgument} {mathOperand} {secondArgument}')

# Sample usage to multiply two numbers
result = calculate('*', 4, 6)

# Injection to remove all files
calculate('', "__import__('os').system('rm -rf *')",''))

```

##### Right

```
def calculate(mathOperand, firstArgument, secondArgument):
    if mathOperand == '+':
        return firstArgument + secondArgument
    elif mathOperand == '-':
        return firstArgument - secondArgument
    elif mathOperand == '*':
        return firstArgument * secondArgument
    elif mathOperand == '/':
        if secondArgument != 0:
            return firstArgument / secondArgument
        else:
            return "Error: Division by zero"
    else:
        return "Error: Invalid operation - Do not hack!"

# This is a quick solution but another smell
# You should avoid this kind of switches and iterate to
# a Polymorphic Hierarchy

```

## Detection

[X] Automatic

You can search for eval() code

## Tags

- Metaprogramming

## Conclusion

Avoid this metaprogramming solution by hardcoding all the possible scenarios and avoiding over-generalizations.

## Relations

[https://maximilianocontieri.com/code-smell-207-dynamic-methods](https://maximilianocontieri.com/code-smell-207-dynamic-methods)
[https://maximilianocontieri.com/code-smell-189-not-sanitized-input](https://maximilianocontieri.com/code-smell-189-not-sanitized-input)
[https://maximilianocontieri.com/code-smell-215-deserializing-object-vulnerability](https://maximilianocontieri.com/code-smell-215-deserializing-object-vulnerability)