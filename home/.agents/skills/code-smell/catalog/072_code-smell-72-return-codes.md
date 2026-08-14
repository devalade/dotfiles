# Code Smell 72 - Return Codes

APIs, Return codes, C Programming Language, We've all been there.

**TL;DR:** Don't return codes to yourself. Raise Exceptions.

## Problems

- IFs

- Code Polluting

- Outdated documentation

- Coupling to accidental codes.

- Functional logic polluted.

## Solutions

- Change Ids and return Generic Exceptions.

- Distinguish Happy Path from Exception Path.

## Sample Code

##### Wrong

```
function createSomething(arguments) {
    //Magic Creation
    success = false; //we failed

    //We failed to create
    if (!success) {
        return {
            object: null,
            errorCode: 403,
            errorDescription: 'We didnt have permission to create...'
        };
    }

    return {
        object: createdObject,
        errorCode: 400,
        errorDescription: ''
    };
}

var myObject = createSomething('argument');
if (myObject.errorCode != 400) {
    console.log(myObject.errorCode + ' ' + myObject.errorDescription)
}
//but myObject does not hold My Object but an implementative
//and accidental array
//from now on me need to remember this

```

##### Right

```
function createSomething(arguments) {
    //Magic Creation
    success = false; //we failed

    //We failed to create
    if (!success) {
        throw new Error('We didnt have permission to create...');
    }

    return createdObject;
}

try {
    var myObject = createSomething('argument');
    //no IFS, just happy path
} catch (exception) {
    //deal with it!
    console.log(exception.message);
}
// myObject holds my expected object

```

## Detection

We can teach our linters to find patterns of integer and strings returns coupled with ifs and return checking.

## Tags

- Exceptions

## Conclusion

Ids and codes are external identifiers.

They are useful when you need to interact with an external system (for example an API Rest).

We should not use them on our own systems and our own internal APIs.

Create and raise generic exceptions.

Only create specific exceptions if you are ready to handle them, and they have specialized behavior.

Don't create anemic Exceptions.

Avoid immature and premature optimized languages favoring return codes.

## Relations

[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)