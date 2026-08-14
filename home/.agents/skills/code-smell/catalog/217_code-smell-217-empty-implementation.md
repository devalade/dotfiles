# Code Smell 217 - Empty Implementation

You create empty methods instead of failing

**TL;DR:** Don't fill in methods to comply

## Problems

- Fail Fast Principle Violation

## Solutions

- Throw an error indicating implementation is not complete

## Sample Code

##### Wrong

```
class MerchantProcessor {
  processPayment(amount) {
    // no default implementation
  }
}

class MockMerchantProcessor extends MerchantProcessor {
  processPayment(amount) {
     // Empty implementation to comply with the compiler
     // Won't do anything
  }
}

```

##### Right

```
class MerchantProcessor {
  processPayment(amount) {
    throw new Error('Should be overridden');
  }
}

class MockMerchantProcessor extends MerchantProcessor {
  processPayment(amount) {
     throw new Error('Will be implemented when needed');
  }
}

// or better...

class MockMerchantProcessor extends MerchantProcessor {
  processPayment(amount) {
    console.log('Mock payment processed: $${amount}');
  }
}

```

## Detection

[X] Manual

Since empty code is valid sometimes only a good peer review will find these problems.

## Tags

- Hierarchies

## Conclusion

Being lazy and deferring certain decisions is acceptable, but it's crucial to be explicit about it.

## Relations

[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)
[https://maximilianocontieri.com/code-smell-114-empty-class](https://maximilianocontieri.com/code-smell-114-empty-class)