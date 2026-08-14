# Code Smell 80 - Nested Try/Catch

Exceptions are a great way of separating the happy path from the trouble path. But we tend to over-complicate our solutions.

**TL;DR:** Don't nest Exceptions. Nobody cares what you do in the inner blocks.

## Problems

- Readability

## Solutions

- Refactor

## Sample Code

##### Wrong

```
try {
    transaction.commit();
} catch (e) {
    logerror(e);
    if (e instanceOf DBError){
      try {
          transaction.rollback();
      } catch (e) {
          doMoreLoggingRollbackFailed(e);
      }
    }
}

// Nested Try catchs
// Exception cases are more important than the happy path
// We use exceptions as control flow

```

##### Right

```
try {
    transaction.commit();
} catch (transactionError) {
    this.withTransactionErrorDo(transationError, transaction);
}

// transaction error policy is not defined in this function
// so we don't have repeated code
// code is more readable
// It is up to the transaction and the error to decide what to do

```

## Detection

We can detect this smell using parsing trees.

## Tags

- Exceptions

## Conclusion

Don't abuse exceptions, don't create Exception classes no one will ever catch, and don't be prepared for every case (unless you have a good real scenario with a covering test).

The happy path should always be more important than exception cases.

## Relations

[https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases](https://maximilianocontieri.com/code-smell-73-exceptions-for-expected-cases)

[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)