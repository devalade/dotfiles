# Code Smell 196 - Javascript Array Constructors

**TL;DR:** Be very careful with Javascript Arrays.

## Problems

- The Least surprise principle violation

## Solutions

- Be as declarative as possible.

- Avoid creating Arrays with one argument.

## Sample Code

##### Wrong

```
const arrayWithFixedLength = new Array(3);

console.log(arrayWithFixedLength); // [ <5 empty items> ]
console.log(arrayWithFixedLength[0]); // Undefined
console.log(arrayWithFixedLength[1]); // Undefined
console.log(arrayWithFixedLength[3]); // Undefined
console.log(arrayWithFixedLength[4]); // Undefined
console.log(arrayWithFixedLength.length); // 3

```

##### Right

```
const arrayWithTwoElements = new Array(3, 1);

console.log(arrayWithTwoElements); // [ 3, 1 ]
console.log(arrayWithTwoElements[0]); // 3
console.log(arrayWithTwoElements[1]); // 1
console.log(arrayWithTwoElements[2]); // Undefined
console.log(arrayWithTwoElements[5]); // Undefined
console.log(arrayWithTwoElements.length); // 2

const arrayWithTwoElementsLiteral = [3,1];

console.log(arrayWithTwoElementsLiteral); // [ 3, 1 ]
console.log(arrayWithTwoElementsLiteral[0]); // 3
console.log(arrayWithTwoElementsLiteral[1]); // 1
console.log(arrayWithTwoElementsLiteral[2]); // Undefined
console.log(arrayWithTwoElementsLiteral[5]); // Undefined
console.log(arrayWithTwoElementsLiteral.length); // 2

```

## Detection

[X] Automatic

We can check for the notation with one argument and flag it as a warning.

## Tags

- Smart

## Conclusion

Many "modern" languages are full of hacks to make life easier for programmers but are a source of potential undiscovered bugs.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)
[https://maximilianocontieri.com/code-smell-93-send-me-anything](https://maximilianocontieri.com/code-smell-93-send-me-anything)