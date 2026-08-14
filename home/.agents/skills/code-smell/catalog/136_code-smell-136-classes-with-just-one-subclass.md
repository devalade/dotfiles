# Code Smell 136 - Classes With just One Subclass

Being generic and foreseeing the future is good (again).

**TL;DR:** Don't over-generalize

## Problems

- Speculative Design

- Complexity

- Over-Engineering

## Solutions

- Remove the abstract class until you get more examples

## Exceptions

Some frameworks create an abstract class as a placeholder to build our models over them.

Subclassifing should be never our first option.

A more elegant solution would be to declare an interface since it is less coupled.

## Sample Code

##### Wrong

```
class Boss(object):
    def __init__(self, name):
        self.name = name

class GoodBoss(Boss):
    def __init__(self, name):
        super().__init__(name)

# This is actually a very classification example
# Bosses should be immutable but can change their mood
# with constructive feedback

```

##### Right

```
class Boss(object):
    def __init__(self, name):
        self.name = name

# Bosses are concrete and can change mood

```

## Detection

[X] Automatic

This is very easy for our linters since they can trace this error at compile time.

## Tags

- Over Design

## Conclusion

We need to wait for abstractions and not be creative and speculative.

## Relations

[https://maximilianocontieri.com/code-smell-114-empty-class](https://maximilianocontieri.com/code-smell-114-empty-class)
[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)
[https://maximilianocontieri.com/code-smell-43-concrete-classes-subclassified](https://maximilianocontieri.com/code-smell-43-concrete-classes-subclassified)
[https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names](https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names)
[https://maximilianocontieri.com/code-smell-135-interfaces-with-just-one-realization](https://maximilianocontieri.com/code-smell-135-interfaces-with-just-one-realization)