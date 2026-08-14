# Code Smell 78 - Callback Hell

Processing an algorithm as a sequence of nested callbacks is not clever.

**TL;DR:** Don't process calls in a callback way. Write a sequence.

## Problems

- Readability

- Hard to debug.

- Complexity

## Solutions

- Change callbacks to sequence calls.

- Extract repeated Code

- Refactor.

## Sample Code

##### Wrong

```
var fs = require('fs');

var fileWithData = '/hello.world';
fs.readFile(fileWithData, 'utf8', function(err, txt) {
    if (err) return console.log(err);

    txt = txt + '\n' + 'Add Data!';
    fs.writeFile(fileWithData, txt, function(err) {
        if(err) return console.log(err);
        console.log('Information added');
    });
});

```

##### Right

```
var fs = require('fs');

function logTextWasAdded(err) {
    if(err) return console.log(err);
    console.log('Information added');
};

function addData(error, actualText) {
    if (error) return console.log(error);

    actualText = actualText + '\n' + 'Add data';
    fs.writeFile(fileWithData, actualText, logTextWasAdded);
}

var fileWithData = 'hello.world';
fs.readFile(fileWithData, 'utf8', addData);

```

## Detection

This problem shines at the naked eye. Many linters can detect this complexity and warn us.

## Tags

- Readability

- Complexity

## Conclusion

Callback Hell is a very common problem in programming languages with futures or promises.

Callbacks are added in an incremental way. There's no much mess at the beginning.

Complexity without refactoring makes them hard to read and debug.