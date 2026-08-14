# Code Smell 138 - Packages Dependency

**TL;DR:** Write your code unless you need an existing complex solution

## Problems

- Coupling

- Security problems

- Architectural complexity

- Packages Corruption

## Solutions

- Import and implement trivial solutions

- Rely on external and mature dependencies

## Sample Code

##### Wrong

```
$ npm install --save is-odd

// https://www.npmjs.com/package/is-odd
// This package has about 500k weekly downloads
// https://github.com/i-voted-for-trump/is-odd/blob/master/index.js

module.exports = function isOdd(value) {
  const n = Math.abs(value);
  return (n % 2) === 1;
};

```

##### Right

```
function isOdd(value) {
  const n = Math.abs(value);
  return (n % 2) === 1;
};

// Just solve it inline

```

## Detection

[X] Automatic

We can check our external dependencies and stick to the minimum.

We can also depend on a certain concrete version to avoid hijacking.

## Tags

- Security

## Conclusion

Lazy programmers push reuse to absurd limits.

We need a good balance between code duplication and crazy reuse.

As always, there are rules of thumb but no rigid rules.

## Relations

[https://maximilianocontieri.com/code-smell-94-too-many-imports](https://maximilianocontieri.com/code-smell-94-too-many-imports)