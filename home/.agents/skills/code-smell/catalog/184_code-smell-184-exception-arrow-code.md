# Code Smell 184 - Exception Arrow Code

**TL;DR:** Don't cascade your exceptions

## Problems

- Readability

- Complexity

## Solutions

- Rewrite the nested clauses

## Sample Code

##### Wrong

```
class QuotesSaver {
    public void Save(string filename) {
        if (FileSystem.IsPathValid(filename)) {
            if (FileSystem.ParentDirectoryExists(filename)) {
                if (!FileSystem.Exists(filename)) {
                    this.SaveOnValidFilename(filename);
                } else {
                    throw new I0Exception("File exists: " + filename);
                }
            } else {
                throw new I0Exception("Parent directory missing at " + filename);
            }
        } else {
            throw new ArgumentException("Invalid path " + filename);
        }
    }
}

```

##### Right

```
public class QuoteseSaver {
    public void Save(string filename) {
        if (!FileSystem.IsPathValid(filename)) {
            throw new ArgumentException("Invalid path " + filename);
        } else if (!FileSystem.ParentDirectoryExists(filename)) {
            throw new I0Exception("Parent directory missing at " + filename);
        } else if (FileSystem.Exists(filename)) {
             throw new I0Exception("File exists: " + filename);
        }
        this.SaveOnValidFilename(filename);
    }
}

```

## Detection

[X] Semi-Automatic

Some linters warn us when we have this kind of complexity

## Tags

- Exceptions

## Conclusion

Exceptions are less critical than normal cases.

If we need to read more exceptional code than normal then it is time to improve our code.

## Relations

[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)
[https://maximilianocontieri.com/code-smell-26-exceptions-polluting](https://maximilianocontieri.com/code-smell-26-exceptions-polluting)