# Code Smell 168 - Undocumented Decisions

**TL;DR:** Be declarative on your design or implementation decisions.

## Problems

- Code Comments

- Lack of testability

## Solutions

- Be Explicit about the reasons.

- Convert the comment to a method.

## Sample Code

##### Wrong

```
// We need to run this process with more memory
set_memory("512k)

run_process();

```

##### Right

```
increase_memory_to_avoid_false_positives();
run_process();

```

## Detection

[X] Semi-Automatic

This is a semantic smell.

We can detect comments and warn us.

## Tags

- Comments

## Conclusion

Code is prose. And design decisions should be narrative.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)
[https://maximilianocontieri.com/code-smell-75-comments-inside-a-method](https://maximilianocontieri.com/code-smell-75-comments-inside-a-method)