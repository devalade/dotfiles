# Code Smell 151 - Commented Code

**TL;DR:** Don't leave commented code. Remove it.

## Problems

- Readability

- Dead Code

- Lack of Coverage

- Lack of Source Version Control

## Solutions

- Remove commented code

- Implement Source Version Control

## Sample Code

##### Wrong

```
function arabicToRoman(num) {
  var decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  var result = '';

  for(var i = 0; i < decimal.length; i++) {
    // print(i)
    while(num >= decimal[i]) {
      result += roman[i];
      num -= decimal[i];
    }
  }
  // if (result > 0 return ' ' += result)

 return result;
}

```

##### Right

```
function arabicToRoman(arabicNumber) {
  var decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  var roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  var romanString = '';

  for(var i = 0; i < decimal.length; i++) {
    while(arabicNumber >= decimal[i]) {
      romanString += roman[i];
      num -= decimal[i];
    }
  }

 return romanString;
}

```

## Detection

[X] Semi-Automatic

Some machine learning analyzers can detect or parse comments and guide as to remove them.

## Tags

- Comments

## Conclusion

We need to remove all commented-out code.

## Relations

[https://maximilianocontieri.com/code-smell-75-comments-inside-a-method](https://maximilianocontieri.com/code-smell-75-comments-inside-a-method)
[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)