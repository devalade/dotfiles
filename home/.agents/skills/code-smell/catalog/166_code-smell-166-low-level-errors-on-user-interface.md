# Code Smell 166 - Low-Level Errors on User Interface

**TL;DR:** Catch your errors. Even the ones you don't expect.

## Problems

- Security

- Error Handling

- Error Logging

- Bad UX Experience

## Solutions

- Use a top-level handler

- Avoid languages favoring return codes

- Expect database and low-level errors

## Sample Code

##### Wrong

```
<?

Fatal error: Uncaught Error: Class 'MyClass' not found
 in /nstest/src/Container.php:9

```

##### Right

```
<?

// A user-defined exception handler function
function myException($exception) {
    logError($exception->description())
    // We don't show Exception to final users
}

// Set user-defined exception handler function
set_exception_handler("myException");

```

## Detection

[X] Automatic

We can use mutation testing to simulate problems and see if they are handled correctly.

## Tags

- Security

## Conclusion

We need to keep maturing.

Our solutions shouldn't be sloppy.

We need to improve our reputation as serious software engineers.

## Relations

[https://maximilianocontieri.com/code-smell-72-return-codes](https://maximilianocontieri.com/code-smell-72-return-codes)