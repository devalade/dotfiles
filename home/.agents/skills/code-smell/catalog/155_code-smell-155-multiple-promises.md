# Code Smell 155 - Multiple Promises

**TL;DR:** Don't block yourself in a sorted way.

## Problems

- Indeterminism

- Performance bottleneck

## Solutions

- Wait for all promises at once.

## Sample Code

##### Wrong

```
async fetchOne() { /* long task */ }
async fetchTwo() { /* another long task */ }

async fetchAll() {
  let res1 = await this.fetchOne();
  let res2 = await this.fetchTwo();
  // they can run in parallel !!
}

```

##### Right

```
async fetchOne() { /* long task */ }
async fetchTwo() { /* another long task */ }

async fetchAll() {
  let [res3, res4] = await Promise.all([this.fetchOne(), this.fetchTwo()]);
  //We wait until ALL are done
}

```

## Detection

[X] Semi-Automatic

This is a semantic smell.

We can tell our linters to find some patterns related to promises waiting.

## Tags

- Performance

## Conclusion

We need to be as close as possible to [real-world]((https://maximilianocontieri.com/what-is-wrong-with-software) business rules.

If the rule states we need to wait for ALL operations, we should not force a particular order.