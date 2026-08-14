# Code Smell 133 - Hardcoded IF Conditions

iF

**TL;DR:** Don't leave a hardcoded mess on IFs.

## Problems

- Testability

- Hardcoded values

- Open/Closed Principle Violation

## Solutions

- Replace all IFs with a dynamic condition or polymorphism.

## Sample Code

##### Wrong

```
private string FindCountryName (string internetCode)
{
  if (internetCode == "de")
    return "Germany";
  else if(internetCode == "fr")
    return "France";
  else if(internetCode == "ar")
    return "Argentina";
    //lots of elses
  else
    return "Suffix not Valid";
}

```

##### Right

```
private string[] country_names = {"Germany", "France", "Argentina"} //lots more
private string[] Internet_code_suffixes= {"de", "fr", "ar" } //more

private Dictionary<string, string> Internet_codes = new Dictionary<string, string>();

//There are more efficient ways for collection iteration
//This pseudocode is for illustration
int currentIndex = 0;
foreach (var suffix in Internet_code_suffixes) {
  Internet_codes.Add(suffix, Internet_codes[currentIndex]);
  currentIndex++;
}

private string FindCountryName (string internetCode) {
  return Internet_codes[internetCode];
}

```

## Detection

[X] Automatic

By checking If/else conditions we can detect hard-coded conditions.

## Tags

- IFs

## Conclusion

In the past, hard-coding was not an option.

With modern methodologies, we learn by hard-coding, and then, we generalize and refactor our solutions.

## Relations

[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)
[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)