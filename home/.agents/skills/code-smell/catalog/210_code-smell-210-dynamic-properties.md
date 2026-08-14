# Code Smell 210 - Dynamic Properties

**TL;DR:** Be explicit with your attributes

## Problems

- Readability

- Scope definition

- Unnoticed typos

## Solutions

- Favor languages forbidding dynamic properties

## Sample Code

##### Wrong

```
class Dream:
    pass

nightmare = Dream()

nightmare.presentation = "I am the Sandman"
# Presentation is not defined
# It is a dynamic property

print(nightmare.presentation)
# Output: "I am the Sandman"

```

##### Right

```
class Dream:
    def __init__(self):
        self.presentation = None

nightmare = Dream()

nightmare.presentation = "I am the Sandman"

print(nightmare.presentation)
# Output: "I am the Sandman"

```

## Detection

[X] Automatic

Most languages have compiler options to avoid them.

## Tags

- Metaprogramming

## Conclusion

Dynamic properties are supported in many programming languages like PHP,    Python, Ruby,  JavaScript,  C#, Objective-C, Swift, Kotlin, etc.

In these languages, dynamic properties can be added to objects at runtime, and accessed using the object's property accessor syntax.

Bear in mind that having public attributes favors Anemic Objects which is another smell.

## Relations

[https://maximilianocontieri.com/code-smell-109-automatic-properties](https://maximilianocontieri.com/code-smell-109-automatic-properties)
[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)