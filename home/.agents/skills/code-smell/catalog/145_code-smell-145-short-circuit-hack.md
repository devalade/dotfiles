# Code Smell 145 - Short Circuit Hack

**TL;DR:** Don't use Boolean comparison for side effect functions.

## Problems

- Readability

- Side Effects

## Solutions

- Convert short circuit into IFs

## Sample Code

##### Wrong

```
userIsValid() && logUserIn();

// this expression is short circuit
// Does not value second statament
// Unless the first one is true

functionDefinedOrNot && functionDefinedOrNot();

// in some languages undefined works as a false
// If functionDefinedOrNot is not defined does
// not raise an erron and neither runs

```

##### Right

```
if (userIsValid()) {
    logUserIn();
}

if(typeof functionDefinedOrNot == 'function') {
    functionDefinedOrNot();
}
// Checking for a type is another code smell

```

## Detection

[X] Semi-Automatic

We can check if the functions are impure and change the short circuit to an IF.

Some actual linters warn us of this problem

## Tags

- Premature Optimization

## Conclusion

Don't try to look smart.

We are not in the 50s anymore.

Be a team developer.

## Relations

[https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation](https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-149-optional-chaining](https://maximilianocontieri.com/code-smell-149-optional-chaining)