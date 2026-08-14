# Code Smell 42 - Warnings/Strict Mode Off

ON

**TL;DR:** don't ignore warnings and alarms. You will regret it.

## Problems

- Missed Errors

- Ripple Effect

- Fail Fast

## Solutions

- Enable all warnings

- Enable preconditions and assertions in production.

- Fail fast

- Design by contract

## Sample Code

##### Wrong

```
array = [];
console.log(array['1'])
//undefined but keep going on

hiddenGlobal = "I am a global"

console.log(hiddenGlobal)
//  I'm a global

```

##### Right

```
array = [];
console.log(array['1'])
//Index Error

noGlobal = "I am not a global"

console.log(noGlobal)
// ReferenceError

var noGlobal = "I am not a global"

console.log(noGlobal)
// I am not a global

```

## Detection

Most languages have warning levels. We should turn most of them ON.

We should run linters to statically analyze our code for potential problems.

## Tags

- Fail Fast

## Conclusion

If we ignore warnings and code moves on sooner or later it will fail.

If the software fails later it will be very difficult for us to find root cause.

Defect will likely be near first warning and far away from the crash.

If we follow the Broken Windows Theory, we should not tolerate any warnings, so a new issue will not pass unnoticed on a sea of tolerated warnings.

## Relations

[https://maximilianocontieri.com/code-smell-19-optional-arguments](https://maximilianocontieri.com/code-smell-19-optional-arguments)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)