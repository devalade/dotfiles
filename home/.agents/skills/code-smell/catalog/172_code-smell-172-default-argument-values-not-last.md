# Code Smell 172 - Default Argument Values Not Last

**TL;DR:** Don't use Optional Arguments before mandatory ones. In fact: Don't use Optional Arguments at all

## Problems

- Fail Fast principle violation

- Readability

## Solutions

- Move your optional arguments last.

- Avoid Optional Arguments.

## Sample Code

##### Wrong

```
<?

function buildCar($color = "red", $model){...}
// First argument with optional argument

buildCar("Volvo")}}
// Runtime error: Missing argument 2 in call to buildCar()

```

##### Right

```
<?

function buildCar($model, $color = "Red", ){...}

buildCar("Volvo")}}
// Works as expected

```

```
def functionWithLastOptional(a, b, c='foo'):
    print(a)
    print(b)
    print(c)
functionWithLastOptional(1, 2)

def functionWithMiddleOptional(a, b='foo', c):
    print(a)
    print(b)
    print(c)
functionWithMiddleOptional(1, 2)

# SyntaxError: non-default argument follows default argument

```

## Detection

[X] Automatic

Many Linters can enforce this rule since we can derive it from function signature.

Also, many compilers directly forbid it.

## Tags

- Readability

## Conclusion

Try to be strict when defining functions to avoid coupling.

## Relations

[https://maximilianocontieri.com/code-smell-19-optional-arguments](https://maximilianocontieri.com/code-smell-19-optional-arguments)