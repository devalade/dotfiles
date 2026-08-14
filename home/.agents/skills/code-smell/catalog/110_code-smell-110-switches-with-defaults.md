# Code Smell 110 - Switches With Defaults

**TL;DR:** Don't add a default clause to your cases. Change it for an exception. Be Explicit.

## Problems

- Coupling

- Fail Fast principle violation

- Open-closed principle violation

## Solutions

- Replace if and cases with polymorphism

- Change the Default code to an Exception

## Sample Code

##### Wrong

```
switch (value) {
  case value1:
    // if value1 matches the following will be executed..
    doSomething();
    break;
  case value2:
    // if value2 matches the following will be executed..
    doSomethingElse();
    break;
  default:
    // if the value does not presently match the above values
    // or future values
    // the following will be executed
    doSomethingSpecial();
    break;
}

```

##### Right

```
switch (value) {
  case value1:
    //if value1 matches the following will be executed..
    doSomething();
    break;
  case value2:
    //if value2 matches the following will be executed..
    doSomethingElse();
    break;
  case value3:
  case value4:
    //We currently know these options exist
    doSomethingSpecial();
    break;
  default:
    //if value does not match the above values we need to take a decision
    throw new Exception('Unexpected case ' + value + ' we need to consider it');
    break;
}

```

## Detection

[X] Semi Automatic

We can tell our linters to warn us on default uses unless there's an exception.

## Tags

- Fail Fast

## Conclusion

Writing robust code doesn't mean we need to take decisions without evidence.

## Relations

[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)