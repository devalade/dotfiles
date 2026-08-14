# Code Smell 71 - Magic Floats Disguised as Decimals

**TL;DR:** Don't trust numbers on immature languages like JavaScript.

## Problems

- Principle of Least Surprise Violation

- Accidental Complexity

- Wrong decimal representations.

## Solutions

- Choose Mature Languages.

- Represent Decimals with Decimals.

## Sample Code

##### Wrong

```
console.log(0.2 + 0.1)
// 0.30000000000000004

//We are adding two decimal numbers
// 2/10  +  1/10
// Result should be 3/10 as we learnt at school

```

##### Right

```
class Decimal {
  constructor(numerator) {
    this.numerator = numerator;
  }
   plus(anotherDecimal) {
      return new Decimal(this.numerator + anotherDecimal.numerator);
  }
   toString() {
      return "0." + this.numerator;
   }}

console.log((new Decimal(2).plus(new Decimal(1))).toString());
// 0.3

//We can represent the numbers with a Decimal class (storing only the numerator)
//or with a generic Fraction class (storing both the numerator and denominator)

```

## Detection

Since this is a language feature, it is difficult to detect. We can ask our linters to prevent us from manipulating numbers this way.

## Tags

- Premature Optimization

- JavaScript

- PHP

## Conclusion

My first programming language was Commodore 64's basic back in 1985.

I was very surprised to discover that 1+1+1 was not always 3. Then they introduced integer types.

JavaScript is 30 years younger, and it has the same immaturity problems.

## Relations

[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)