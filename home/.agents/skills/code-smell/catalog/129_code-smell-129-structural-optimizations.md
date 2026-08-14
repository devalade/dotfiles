# Code Smell 129 - Structural Optimizations

**TL;DR:** Don't optimize anything until you have a real-use scenario benchmark.

## Problems

- Readability

- Bijection and MAPPER violations

- Premature Optimization

## Solutions

- Cover your scenarios with tests.

- Write readable (and possibly non-performant) code.

- Do a real benchmark with real user data. (No, iterating your code 100,000 times might not be a real use case).

- If you have conclusive data, you need to improve the benchmark's found bottlenecks using the Pareto principle.

- Attack the worst 20% of problems causing 80% bad performance.

## Sample Code

##### Wrong

```
for (k = 0; k < 3 * 3; ++k) {
     i = Math.floor(k / 3);
     j = k % 3;
     console.log(i + ' ' +  j);
  }

// This cryptic piece of code iterates a
//two-dimensional array
// We don't have proof this will be useful
// In real contexts

```

##### Right

```
for (innerIterator = 0; innerIterator < 3; innerIterator++) {
  for (outerIterator = 0; outerIterator < 3; outerIterator++) {
   console.log(innerIterator + ' ' +  outerIterator);
  }
 }

// This is a readable double for-loop
// 3 is a small number
// No performance issues (by now)
// We will wait for real evidence

```

## Detection

[X] Manual

This is a semantic smell.

We might find the code harder to read.

## Tags

- Premature Optimization

## Conclusion

We need to stop optimizing for machines and start optimizing for human readers and code maintainers.

We need to avoid programming languages designed for premature optimization and favor robust ones.

## Relations

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)