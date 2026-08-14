# Code Smell 222 - Comma Operator

for loops

**TL;DR:** Use comma operator just for loops

## Problems

- Readability

- Hidden Defects

## Solutions

- Avoid operator usage

- Prefer foreach operator

- Break the sentences

## Exceptions

- For loops are a valid exception dough they might lead you to another code smell

## Sample Code

##### Wrong

```
const gravitationalConstant = 6.67430e-11;

const massBlackHole1 = 1.5e31;  // Mass of the first black hole in kg
const massBlackHole2 = 2.2e32;  // Mass of the second black hole in kg
const distanceBlackHoles = 5.7e20;  // Distance between black holes in meters

var force = (distanceSquared = distanceBlackHoles * distanceBlackHoles,
             (gravitationalConstant * massBlackHole1 * massBlackHole2) /
             distanceSquared);

// Two operations in a single statement with comma operator

console.log("Gravitational force between two black holes:", force);

```

##### Right

```
function calculateGravitationalForce(mass1, mass2, distance) {
  const gravitationalConstant = 6.67430e-11;
  return (gravitationalConstant * mass1 * mass2) / (distance * distance);
}

const massBlackHole1 = 1.5e31;  // Mass of the first black hole in kg
const massBlackHole2 = 2.2e32;  // Mass of the second black hole in kg
const distanceBlackHoles = 5.7e20;  // Distance between black holes in meters

const force = calculateGravitationalForce(
  massBlackHole1,
  massBlackHole2,
  distanceBlackHoles
);

// Notice force is calculated with a separate function

console.log("Gravitational force between two black holes:", force);

```

## Detection

[X] Automatic

Many linters can detect this problem.

## Tags

- Readability

## Conclusion

This valid operator was designed to shorten for loops but is now sometimes abused.

## Relations

[https://maximilianocontieri.com/code-smell-53-explicit-iteration](https://maximilianocontieri.com/code-smell-53-explicit-iteration)