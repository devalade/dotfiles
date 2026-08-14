# Code Smell 84 - Max &lt; Min (Javascript)

Some functions do not behave as expected. Sadly, most programmers accept them.

**TL;DR:** Don't trust max() and min() functions. Just ignore them.

## Problems

- Principle of least astonishment

- Bijection Violation.

- Unexpected Results

## Solutions

- Use mature languages.

- Avoid max() and min() functions.

- Model Infinites carefully.

## Sample Code

##### Wrong

```
console.log(Math.max() > Math.min());

//returns false

console.log(Math.max());

//returns -Infinite

```

##### Right

```
console.log(Math.max() > Math.min());
console.log(Math.max());

//returns Exception. Not enough arguments passed.
//Max requires at least one argument

```

## Detection

These functions belong to the standard Math library. Therefore, they are not easy to avoid.

We can block them on our linters.

## Tags

- Javascript

## Conclusion

We need to be very careful using functions that violate real-world concepts using language tricks.

## Relations

[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)