# Code Smell 201 - Nested Ternaries

**TL;DR:** Don't use nested IFs or nested ternaries

## Problems

- Readability

- Default Case

## Solutions

- Rewrite the code as an IF condition with an early return

## Sample Code

##### Wrong

```

const getUnits = secs => (
 secs <= 60       ? 'seconds' :
 secs <= 3600     ? 'minutes' :
 secs <= 86400    ? 'hours'   :
 secs <= 2592000  ? 'days'    :
 secs <= 31536000 ? 'months'  :
                    'years'
)

```

##### Right

```

const getUnits = secs => {
 if (secs <= 60) return 'seconds';
 if (secs <= 3_600) return 'minutes';
 if (secs <= 86_400) return 'hours';
 if (secs <= 2_592_000) return 'days';
 if (secs <= 31_536_000) return 'months';
 return 'years'
}

// More declarative

const getUnits = secs => {
 if (secs <= 60) return 'seconds';
 if (secs <= 60 * 60) return 'minutes';
 if (secs <= 24 * 60 * 60) return 'hours';
 if (secs <= 30 * 24 * 60 * 60) return 'days';
 if (secs <= 12 * 30 * 24 * 60 * 60) return 'months';
 return 'years'
}

```

## Detection

[X] Automatic

Linters can detect this complexity using parsing trees.

## Tags

- IFs

## Conclusion

We must deal with accidental complexity to improve code readability.

## Relations

[https://maximilianocontieri.com/code-smell-133-hardcoded-if-conditions](https://maximilianocontieri.com/code-smell-133-hardcoded-if-conditions)
[https://maximilianocontieri.com/code-smell-78-callback-hell](https://maximilianocontieri.com/code-smell-78-callback-hell)
[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)