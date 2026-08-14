# Code Smell 259 - Testing with External Resources

**TL;DR:** Tests must be in full control.

## Problems

- Unreliable tests

- Difficult debugging

- Unexpected changes

- Coupling to External dependencies

- Mistery Guests

- Flaky tests

- Slowness

## Solutions

- Generate the file in the test

- Mock it

- Use hardcoded streams instead

## Sample Code

##### Wrong

```
const fs = require('fs');

function trimFile(data) {
    return data.trim();
}

// existing_file.txt holds the sample information
// "     John Wick    "

test('test process file', () => {
    const data = fs.readFileSync('existing_file.txt', 'utf8');
    expect(trimFile(data)).toBe('John Wick');
});

```

##### Right

```
const fs = require('fs');
const { jest } = require('@jest/globals');

function trimFile(data) {
    return data.trim();
}

function generateTestData() {
    return ' John Wick ';
}

test('test process file generated', () => {
    const data = generateTestData();
    expect(trimFile(data)).toBe('John Wick');
});

test('test process file mocked', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(' mocked data ');
    const data = fs.readFileSync('file.txt', 'utf8');
    expect(trimFile(data)).toBe('John Wick');
    fs.readFileSync.mockRestore();
});

```

## Detection

[X] Automatic

You can detect this smell by identifying tests that rely on external files instead of generating or mocking the data.

Look for file path references and check if they are necessary.

## Tags

- Testing

## Conclusion

Never use existing files and keep your tests runnable to a known state.

You need to generate your test data either by the test or mock it out completely so that tests are in full control.

## Relations

[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)
[https://maximilianocontieri.com/code-smell-254-mystery-guest](https://maximilianocontieri.com/code-smell-254-mystery-guest)
[https://maximilianocontieri.com/code-smell-52-fragile-tests](https://maximilianocontieri.com/code-smell-52-fragile-tests)
[https://maximilianocontieri.com/code-smell-204-tests-depending-on-dates](https://maximilianocontieri.com/code-smell-204-tests-depending-on-dates)