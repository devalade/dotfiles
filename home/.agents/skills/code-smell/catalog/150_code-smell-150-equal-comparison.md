# Code Smell 150 - Equal Comparison

single point

**TL;DR:** Don't export and compare, just compare.

## Problems

- Encapsulation break

- Code Duplication

- Information Hiding violation

- Anthropomorphism violation

## Solutions

- Hide the comparison in a single method

## Sample Code

##### Wrong

```
if (address.street == 'Broad Street') {

if (location.street == 'Bourbon St') {

// 15000 usages in a big system
// Comparisons are case sensitive

```

##### Right

```
if (address.isAtStreet('Broad Street') {
    }

// ...

if (location.isAtStreet('Bourbon St') {
    }
// 15000 usages in a big system

function isAtStreet(street) {
  // We can change Comparisons to case sensitive in just one place.
}

```

## Detection

[X] Semi-Automatic

We can detect attribute comparison using syntax trees.

There can be good uses for primitive types as with many other smells.

## Tags

- Encapsulation

## Conclusion

We need to put responsibilities in a single place.

Comparing is one of them.

If some of our business rules change we need to change a single point.

## Relations

[https://maximilianocontieri.com/code-smell-63-feature-envy](https://maximilianocontieri.com/code-smell-63-feature-envy)

[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)
[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)