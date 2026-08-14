# Code Smell 209 - Side Effects

**TL;DR:** Avoid side effects on your code.

## Problems

- Coupling

- Least Astonishment Principle violation

## Solutions

- Favor referential transparency

## Sample Code

##### Wrong

```
let counter = 0;

function incrementCounter(value: number): void {
  // Two side effects
  counter += value; // it modifies the global variable counter
  console.log(`Counter is now ${counter}`); // it logs a message to the console.
}

```

##### Right

```
let counter = 0;

function incrementCounter(counter: number, value: number): number {
  return counter + value; // Not too efficient
}

```

## Detection

[X] Automatic

Most linterns can warn you when accessing the global state or Functions and create side effects.

## Tags

- Global

## Conclusion

Functional Programming is amazing and can teach us a lot about how to write clean code.

We need to understand its pillars.

## Relations

[https://maximilianocontieri.com/code-smell-17-global-functions](https://maximilianocontieri.com/code-smell-17-global-functions)