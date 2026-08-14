# Code Smell 240 - Dead Store

**TL;DR:** Don't Assign and overwrite values

## Problems

- Readability

- Dead Code

- Inefficiency

## Solutions

- Remove the sentences that have no effect.

## Exceptions

- You should not optimize functions with side effects

## Sample Code

##### Wrong

```
<?

$lastGoalAuthor = "Lio Messi";
$lastGoalAuthor ="Ángel Di María";
$lastGoalAuthor = "Lio Messi";

// This is stored unconditionally
// You can optimize it by removing the first two statements
// Since storing in a variable has no side effects

```

##### Right

```
<?

$lastGoalAuthor = "Lio Messi";
// If you want to keep the last one

$goalAuthors[] = "Lio Messi";
$goalAuthors[] = "Ángel Di María";
$goalAuthors[] = "Lio Messi";
// If you want to keep a list

$lastGoalAuthor = firstGoalAutor();
$lastGoalAuthor = secondGoalAutor();
$lastGoalAuthor = thirdGoalAutor();

// This might be valid since functions in
// Object-Oriented Programming might have side effects
// and you cannot remove the first ones
// Unless you ensure they don't have side effects

```

## Detection

[X] Automatic

Several linters can find this problem using ASTs

## Tags

- Bloaters

## Conclusion

Avoiding dead store code helps improve code quality, maintainability, and resource efficiency.

It contributes to a more understandable, robust, and bug-free codebase.

Regular code reviews, static analysis tools, and good programming practices can aid in identifying and addressing dead store code smells.

## Relations

[https://maximilianocontieri.com/code-smell-09-dead-code](https://maximilianocontieri.com/code-smell-09-dead-code)
[https://maximilianocontieri.com/code-smell-54-anchor-boats](https://maximilianocontieri.com/code-smell-54-anchor-boats)