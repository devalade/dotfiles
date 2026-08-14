# Code Smell 01 - Anemic Models

'a bunch of attributes'

**TL;DR:** Don't use objects as data structures

## Problems

- No Encapsulation.

- No mapping to real world entities.

- Duplicate Code

- Coupling

- Writer / Reader mismatch.

## Solutions

1) Find Responsibilities.

2) Protect your attributes.

3) Hide implementations.

4) Delegate

## Sample Code

##### Wrong

```
class Window:
    def __init__(self):
        self.height = None
        self.width = None

    def getHeight(self):
        return self.height

    def setHeight(self, height):
        self.height = height

    def getWidth(self):
        return self.width

    def setWidth(self, width):
        self.width = width

```

##### Right

```
class GraphicWindow:

  def area(self):
    # implementation
    return

  def open(self):
    # implementation
    return

  def isOpen(self):
    # implementation
    return

```

## Detection

Sophisticated linters can automate detection.
They should ignore setters and getters and count real behavior methods.

## Tags

- Anemic
- OOP as Data
- Encapsulation
- Setters/Getters
- Mutability

## Conclusion

Avoid anemic models. Focus always on protocol instead of data.
Behaviour is essential, data is accidental.

## Also Known As

>Also Known as

- Data Class

## Relations

[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)
[https://maximilianocontieri.com/code-smell-15-missed-preconditions-1](https://maximilianocontieri.com/code-smell-15-missed-preconditions-1)