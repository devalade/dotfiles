# Code Smell 74 - Empty Lines

Breaking the code to favor readability asks for refactor.

## Problems

- Readability

- Kiss

- Low Reuse

## Solutions

- Extract Method

- Refactor

- Remove unneeded lines.

## Sample Code

##### Wrong

```
<?

function translateFile() {
    $this->buildFilename();
    $this->readFile();
    $this->assertFileContentsAreOk();
    //A lot of lines more

    //Empty space to pause definition
    $this->translateHiperLinks();
    $this->translateMetadata();
    $this->translatePlainText();

    //Yet Another empty space
    $this->generateStats();
    $this->saveFileContents();
    //A lot of more lines
}

```

##### Right

```
<?

function translateFile() {
    $this->readFileToMemoy();
    $this->translateContents();
    $this->saveFileContents();
}

```

## Detection

This is a policy smell. Every linter can detect blank lines and warn us.

## Tags

- Readability

- Long Methods

## Conclusion

Empty lines are harmless, but show us an opportunity to break the code into small steps.

If you break your code with comments, it is also a code smell asking for a refactor.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)