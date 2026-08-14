# Code Smell 95 - Premature Classification

We are over generalizers. We shouldn't create abstractions until we see enough concretions.

**TL;DR:** Don't guess what the future will bring you.

## Problems

- Futurology

- Bad designs

## Solutions

- Wait for concretions

- Refactor late

## Sample Code

##### Wrong

```
class Rectangle
 {
       int length;
       int breadth;

       int area()
       {
         return length * breadth;
       }
 }
//We are creating a premature abstraction
//And misusing is-a relation since a Square "is a" Rectangle

class Square extends Rectangle
 {
       int length;

       int area()
       {
         return length * length;
       }
 }

```

##### Right

```
class Rectangle
 {
       int length;
       int breadth;

       int area()
       {
         return length * breadth;
       }
 }

class Square
{
       int length;

       int area()
       {
         return length * length;
       }
 }
//Square might-be a Rectangle
//But it does not follow behaves-like relation so we won't go ahead
//and create a strong relation between them
//Maybe they are shapes. We don't have enough examples and protocol yet
//We will not guess until further knowledge

```

## Detection

An abstract class with just one subclass is an indicator of premature classification

## Tags

- Bad Design

- Classification

## Conclusion

When working with classes, we name abstractions as soon as they appear.

Our rule is to choose good names after the behaviour.

We should not name our abstractions until we name our concrete subclasses.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)