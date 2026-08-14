# Code Smell 248 - Unreliable Copy

copy()

**TL;DR:** Don't rely on external solutions without good handlers

## Problems

- Silent Modifications

- Least Surprise Principle violation

- Fail Fast Principle Violation

## Solutions

- Ensure you meet your function's postconditions

- Use mature languages

## Sample Code

##### Wrong

```
<?

  $sourceFile = 'C:\temp\source.txt';
  $destination = 'C:\temp\destination.txt';
  $copyWasSuccessful = copy($sourceFile, $destination); // true
  $destinationFileExists = file_exists($destination); // true

  $sourceFile = 'C:\temp\source.txt';
  $destination = 'C:\temp\destination :txt';
  // The filename is simplified
  // and might come from a programmatic construction

  $copyWasSuccessful = copy($sourceFile, $destination); // false

  $destinationFileExists = file_exists($destination);
  // false since it was not created

  $destinationChangedFileExists = file_exists('C:\temp\destination ');
  // true but unexpected

```

##### Right

```
<?

  $sourceFile = 'C:\temp\source.txt';
  $destination = 'C:\temp\destination :txt';
  // The filename is simplified
  // and might come from a programmatic construction

  $copyWasSuccessful = copy($sourceFile, $destination);
  if (!$copyWasSuccessful || !$file_exists($destination)) {
    // Don't trust the function result. Handle the postcondition error
  }

```

## Detection

[X] Semi-Automatic

You can check all copy() handlers and wrap them

## Tags

- Fail Fast

## Conclusion

Always check important function's post-conditions even if you think you will have performance penalties.

## Relations

[https://maximilianocontieri.com/code-smell-15-missed-preconditions-1](https://maximilianocontieri.com/code-smell-15-missed-preconditions-1)