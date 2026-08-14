# Code Smell 86 - Mutable Const Arrays

Const declares something to be constant. Can it mutate?

**TL;DR:** Don't rely on languages cheating about directives.

## Problems

- Unexpected side effects

- Accidental complexity

## Solutions

- Use better languages.

- Use spread operator.

## Sample Code

##### Wrong

```
const array = [1, 2];

array.push(3)

//array => [1, 2, 3]
//Wasn't it constant ?
//constant != immutable ?

```

##### Right

```
const array = [1, 2];

const newArray = [...array,3 ]

//array => [1, 2] Didn't mutate
//newArray = [1, 2, 3]

```

## Detection

Since this is a "language feature", we can explicitly forbid it.

## Tags

- Mutability

- JavaScript

## Conclusion

We should always favour immutability on our designs and take extra care with side effects.