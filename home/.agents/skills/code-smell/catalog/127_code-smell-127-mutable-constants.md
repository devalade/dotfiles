# Code Smell 127 - Mutable Constants

You declare something a constant. But you can mutate it.

**TL;DR:** Use immutable constants

## Problems

- Mutability

- The Least Surprise Principle violation

- Coupling

## Solutions

- Enforce mutability

- Avoid constants. They are hard to mock in tests.

## Sample Code

##### Wrong

```
const DISCOUNT_PLATINUM = 0.1;
const DISCOUNT_GOLD = 0.05;
const DISCOUNT_SILVER = 0.02;

//Since variables are constants we cannot reassign them
const DISCOUNT_PLATINUM = 0.05; //Error

//We can group them
const ALL_CONSTANTS = {
  DISCOUNT: {
    PLATINUM = 0.1;
    GOLD = 0.04;
    SILVER = 0.02;
  },
};

const ALL_CONSTANTS = 3.14; //Error

ALL_CONSTANTS.DISCOUNT.PLATINUM = 0.08; //NOT AN ERROR. WTF!

const ALL_CONSTANTS = Object.freeze({
  DISCOUNT:
    PLATINUM = 0.1;
    GOLD = 0.05;
    SILVER = 0.02;
});

const ALL_CONSTANTS = 3.14; //Error

ALL_CONSTANTS.DISCOUNT.PLATINUM = 0.12; //NOT AN ERROR. WTF!

```

##### Right

```
export const ALL_CONSTANTS = Object.freeze({
  DISCOUNT: Object.freeze({
    PLATINUM = 0.1;
    GOLD = 0.05;
    SILVER = 0.02;
  }),
});

const ALL_CONSTANTS = 3.14; //Error

ALL_CONSTANTS.DISCOUNT.PLATINUM = 0.12; //ERROR

//Code works, but it is coupled and we cannot test it

Class TaxesProvider {
  applyPlatinum(product);
}

//Now we can couple to a interface (the protocol of taxes provider)
//Since class has no setters it is constant an immuatable
//And we can replace it on tests

```

## Detection

[X] Semi-Automatic

We can perform mutation testing to find changed values.

## Tags

- Constants

## Conclusion

Mutability is very important.

We need to enforce it with the right tools.

## Relations

[https://maximilianocontieri.com/code-smell-86-mutable-const-arrays](https://maximilianocontieri.com/code-smell-86-mutable-const-arrays)
[https://maximilianocontieri.com/code-smell-107-variables-reuse](https://maximilianocontieri.com/code-smell-107-variables-reuse)
[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)