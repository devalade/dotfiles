# Code Smell 239 - Big Pull Request

**TL;DR:** Always stick to baby steps

## Problems

- Readability

- Code Review time and complexity

- Merge Conflicts

- Testing Challenges

## Solutions

- Break the change in atomic parts

## Exceptions

- Big refactors that cannot be made with baby steps

## Sample Code

##### Wrong

```
function generateFibonacci(ordinal) {
  const fibonacciSequence = [0, 1];

  for (let index = index; index < ordinal; index++) {
    const nextFibonacci = fibonacciSequence[index - 1]
          + fibonacciSequence[index - 2];
    fibonacciSequence.push(nextFibonacci);
  }

  return fibonacciSequence;
}

// This function solves a very different problem
// You should not mix them in a single pull request

function voyagerDistanceFromEarth(currentDistanceInKms, yearsTravelled) {
  const speedOfVoyagerInKmS = 17;

  return currentDistanceInKms +
        speedOfVoyagerInKmS * yearsTravelled * 60 * 60 * 24 * 365.25;
}

```

##### Right

```
function generateFibonacci(ordinal) {
  const fibonacciSequence = [0, 1];

  for (let index = index; index < ordinal; index++) {
    const nextFibonacci = fibonacciSequence[index - 1]
          + fibonacciSequence[index - 2];
    fibonacciSequence.push(nextFibonacci);
  }

  return fibonacciSequence;
}

// You break it into two different pull requests

```

## Detection

[X] Automatic

You can put a threshold and a warning on big merge requests.

## Tags

- Complexity

## Conclusion

Software engineers must be experts at managing (and avoiding) accidental complexity.

## Relations

[https://maximilianocontieri.com/code-smell-170-refactor-with-functional-changes](https://maximilianocontieri.com/code-smell-170-refactor-with-functional-changes)