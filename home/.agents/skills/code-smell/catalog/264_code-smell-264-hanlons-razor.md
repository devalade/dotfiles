# Code Smell 264 - Hanlon's Razor

every

**TL;DR:** Overdefensive code leads to unnecessary complexity.

## Problems

- Unnecessary complexity

- Confusing logic

- Hidden bugs

- Harder maintenance

- Slower performance

- Cluttered Code

## Solutions

- Simplify checks

- Trust your logic

- Focus on essentials

- Follow the K.I.S.S. principle

- Refactor regularly

## Sample Code

##### Wrong

```
function processData(data) {
    if (typeof data === 'undefined') {
        throw new Error('Data is undefined');
    }

    if (typeof data !== 'object') {
        throw new Error('Data is not an object');
    }

    if (data === null) {
        throw new Error('Data is null');
    }

    if (Array.isArray(data)) {
        throw new Error('Data should not be an array');
    }

    if (!data.hasOwnProperty('items')) {
        return [];
    }

    if (!Array.isArray(data.items)) {
        throw new Error('Items should be an array');
    }

    if (data.items.length === 0) {
        return [];
    }

    let processedItems = [];
    for (let item of data.items) {
        if (typeof item === 'undefined') {
            continue; // Skip undefined items
        }

        if (typeof item !== 'object') {
            continue; // Skip non-object items
        }

        if (item === null) {
            continue; // Skip null items
        }

        processedItems.push(processItem(item));
    }

    return processedItems;
}

```

##### Right

```
function processData(data) {
    if (!Array.isArray(data.items)) {
        throw new Error('Invalid data');
    }

    return data.items
        .filter(item => typeof item === 'object' && item !== null)
        .map(item => processItem(item));
}

```

## Detection

[X] Manual

Complicated code usually has more lines and long methods are a possible hint.

## Tags

- Bloaters

## Conclusion

Avoid overthinking and overdesigning your code.

Focus on the most likely scenarios and write clear, straightforward logic.

Simplicity leads to better code quality and easier maintenance.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)