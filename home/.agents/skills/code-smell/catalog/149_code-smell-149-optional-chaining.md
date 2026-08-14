# Code Smell 149 - Optional Chaining

Our code is more robust and legible. But we hide NULL under the rug

**TL;DR:** Avoid Nulls and undefined. If you avoid them you will never need Optionals.

## Problems

- Nulls

- IF Polluting

## Solutions

- Remove nulls

- Deal with undefined

## Sample Code

##### Wrong

```
const user = {
  name: 'Hacker'
};

if (user?.credentials?.notExpired) {
  user.login();
}

user.functionDefinedOrNot?.();

// Seems compact but it is hacky and has lots
// of potential NULLs and Undefined

```

##### Right

```
function login() {}

const user = {
  name: 'Hacker',
  credentials: { expired: false }
};

if (!user.credentials.expired) {
  login();
}

// Also compact
// User is a real user or a polymorphic NullUser
// Credentials are always defined.
// Can be an instance of InvalidCredentials
// Assuming we eliminated nulls from our code

if (user.functionDefinedOrNot !== undefined) {
    functionDefinedOrNot();
}

// This is also wrong.
// Explicit undefined checks are yet another code smell

```

## Detection

[X] Automatic

This is a Language Feature.

We can detect it and remove it.

## Tags

- Null

## Conclusion

Many developers feel safe polluting the code with null dealing.

In fact, this is safes than not treating NULLs at all.

Nullish Values, Truthy and Falsy are also code smells.

We need to aim higher and make cleaner code.

The good: remove all nulls from your code

The bad: use optional chaining

The ugly: not treating nulls at all

## Relations

[https://maximilianocontieri.com/code-smell-145-short-circuit-hack](https://maximilianocontieri.com/code-smell-145-short-circuit-hack)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)
[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)