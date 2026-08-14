# Code Smell 171 - Plural Classes

**TL;DR:** Classes represent concepts. And concepts are singular.

## Problems

- Naming

- Code Standards

## Solutions

- Rename classes to singular

## Sample Code

##### Wrong

```
class Users

```

##### Right

```
class User

```

## Detection

[X] Automatic

This is a syntactic rule.

## Tags

- Naming

## Conclusion

Name concepts in the singular.

Classes are concepts.