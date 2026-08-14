# Code Smell 158 - Variables not Variable

**TL;DR:** Be declarative on mutability.

## Problems

- Readability

- Honor the Bijection mutability.

- Potential performance and memory issues.

## Solutions

- Change the variable to a constant and be clear on its scope

## Sample Code

##### Wrong

```
<?php

function configureUser() {
  $password = '123456';
  // Setting a password on a variable is another vulnerability
  // And Code Smell
  $user = new User($password);
}

```

##### Right

```
<?php

define("USER_PASSWORD", '123456')

function configureUser() {
  $user = new User(USER_PASSWORD);
}

// or

function configureUser() {
  $user = new User(userPassword());
}

function userPassword() : string {
  return '123456';
}

// Case is an oversimplification as usual

```

## Detection

[X] Automatic

Many linters check if the variable has just one assignment.

We can also perform mutation testing and try to modify the variable to see if tests break.

## Tags

- Mutability

## Conclusion

We must challenge ourselves and refactor when the variable scope is clear and we learn more about its properties and mutability.

## Relations

[https://maximilianocontieri.com/code-smell-116-variables-declared-with-var](https://maximilianocontieri.com/code-smell-116-variables-declared-with-var)
[https://maximilianocontieri.com/code-smell-127-mutable-constants](https://maximilianocontieri.com/code-smell-127-mutable-constants)
[https://maximilianocontieri.com/code-smell-107-variables-reuse](https://maximilianocontieri.com/code-smell-107-variables-reuse)
[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)