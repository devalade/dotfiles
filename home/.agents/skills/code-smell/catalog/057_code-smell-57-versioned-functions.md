# Code Smell 57 - Versioned Functions

sort, sortOld, sort20210117, workingSort, It is great to have them all. Just in case

## Problems

- Readability

- Maintainability

## Solutions

- Keep just one working version of your artifact (class, method, attribute).

- Leave time control to your version control system.

## Sample Code

##### Wrong

```
findMatch()
findMatch_new()
findMatch_newer()
findMatch_newest()
findMatch_version2()
findMatch_old()
findMatch_working()
findMatch_for_real()
findMatch_20200229()
findMatch_thisoneisnewer()
findMatch_themostnewestone()
findMatch_thisisit()
findMatch_thisisit_for_real()

```

##### Right

```
findMatch()

```

## Detection

We can add automatic rules to find versioned methods with patterns.

Like many other patterns we might create an internal policy and communicate.

## Tags

- Versioning

## Conclusion

Time and code evolution management is always present in software development. Luckily nowadays we have mature tools to address this problem.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)