# Code Smell 235 - Console Side Effects

**TL;DR:** Avoid side effects. Always.

## Problems

- Coupling

- Testability

- Reusability

- Function Composition

## Solutions

- Decouple the code and avoid side-effects

- Inject the output destination

## Sample Code

##### Wrong

```
function drawChristmasTree(height) {
  let tree = '';
  let currentFloor = 1;

  while (currentFloor <= height) {
      tree += ' '.repeat(height - currentFloor) + '🎄'.repeat(currentFloor) + '\n';
      currentFloor++;
  }

  // This function has side effects
  // You cannot test it
  console.log(tree);
}

drawChristmasTree(7);

```

##### Right

```
function createChristmasTree(height) {
  let tree = '';
  let currentFloor = 1;

  while (currentFloor <= height) {
      tree += ' '.repeat(height - currentFloor) + '🎄'.repeat(currentFloor) + '\n';
      currentFloor++;
  }

  return tree;
}

// The side effects are OUTSIDE the function
console.log(createChristmasTree(7));

// You can also test it

const createChristmasTree = createChristmasTree(7);

describe('createChristmasTree', () => {
  it('should create a Christmas tree of the specified height', () => {
    const expectedTree =
      '      🎄\n' +
      '     🎄🎄\n' +
      '    🎄🎄🎄\n' +
      '   🎄🎄🎄🎄\n' +
      '  🎄🎄🎄🎄🎄\n' +
      ' 🎄🎄🎄🎄🎄🎄\n' +
      '🎄🎄🎄🎄🎄🎄🎄\n';

    const result = createChristmasTree(7);
    expect(result).toEqual(expectedTree);
  });

});

```

## Detection

[X] Automatic

Several linters warn for this usage

## Tags

- Globals

## Conclusion

Instead of logging directly within internal functions, a more modular and flexible approach is to have functions return values or throw exceptions when errors occur.

The calling code can then decide how to handle and log these results based on the application's logging strategy.

## Relations

[https://maximilianocontieri.com/code-smell-17-global-functions](https://maximilianocontieri.com/code-smell-17-global-functions)