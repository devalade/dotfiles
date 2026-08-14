# Code Smell 176 - Changes in Essence

Mutation is good. Things change

**TL;DR:** Don't change essential attributes or behavior

## Problems

- Bijection violation

- Mutability

- Ripple Effect

## Solutions

- Protect essential attributes from change.

- Remove setters

## Sample Code

##### Wrong

```
const date = new Date();
date.setMonth(4);

```

##### Right

```
const date = new Date("2022-03-25");

```

## Detection

[X] Manual

This is a semantic smell. We need to model which attributes/behaviors are essential and which are accidental.

## Tags

- Mutability

## Conclusion

We need to favor immutable objects.

Objects can mutate in accidental ways, not in essential ones.

## Relations

[https://maximilianocontieri.com/code-smell-16-ripple-effect](https://maximilianocontieri.com/code-smell-16-ripple-effect)