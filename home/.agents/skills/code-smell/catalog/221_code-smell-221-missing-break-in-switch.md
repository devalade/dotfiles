# Code Smell 221 - Missing Break in Switch

break

**TL;DR:** Cases are GOTOs, but you might be missing them

## Problems

- Hidden defects

- Readability

## Solutions

- Add the missing break

- Convert the switch into a polymorphic hierarchy

- Remove the default switch

## Sample Code

##### Wrong

```
  switch (number) {
      case 1:
          printf("Number is 1.\n");
          break;
      case 2:
          printf("Number is 2.\n");
          // Missing break
      case 3:
          // Case 2 will continue here
          printf("Number is 3.\n");
          break;
      default:
          printf("Number is not 1, 2, or 3.\n");
  }

// If the number is 2 this will output numbers 2 and 3

```

##### Right

```
  switch (number) {
      case 1:
          printf("Number is 1.\n");
          break;
      case 2:
          printf("Number is 2.\n");
          break; // Added 'break' to prevent fall-through
      case 3:
          printf("Number is 3.\n");
          break;
      default:
          printf("Number is not 1, 2, or 3.\n");
  }

// This is correct even though switches AND defaults
// Are other code smells

```

## Detection

[X] Automatic

Many linters and also ChatGPT detect this smell.

## Tags

- IFs

## Conclusion

Using switches and causes is problematic, your need to use higher-level sentences.

## Relations

[https://maximilianocontieri.com/code-smell-110-switches-with-defaults](https://maximilianocontieri.com/code-smell-110-switches-with-defaults)
[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)
[https://maximilianocontieri.com/code-smell-100-goto](https://maximilianocontieri.com/code-smell-100-goto)