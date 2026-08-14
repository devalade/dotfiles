# Code Smell 280 - Spaghetti Code

BASIC

**TL;DR:** GOTO statements create confusing and unmaintainable code

## Problems

- Logic becomes unclear
- Debugging gets harder
- Flow jumps erratically
- Code lacks structure
- Maintenance becomes difficult

## Solutions

- Use structured programming
- Replace with loops
- Simplify control flow
- Avoid unnecessary jumps

## Sample Code

##### Wrong

```
0 REM Request a Zero
10 INPUT "Enter a number: ", N
20 IF N = 0 THEN GOTO 50
30 PRINT "Number is non-zero"
40 GOTO 10
50 PRINT "Goodbye"
60 END

```

##### Right

```
10 DO
20   INPUT "Enter a number: ", N
30   IF N <> 0 THEN PRINT "Number is non-zero"
40 LOOP UNTIL N = 0
50 PRINT "Goodbye"
60 END

```

## Detection

[X] Automatic

You can detect this smell by scanning for frequent GOTO usage, especially when they jump between unrelated code sections.

Look for logical breaks caused by excessive jumping and ask if structured control flow can replace them.

## Tags

- Coupling

## Conclusion

Overusing GOTO creates chaotic and unmanageable code.

Replace it with structured programming techniques to improve readability and maintainability.

## Relations

[https://maximilianocontieri.com/code-smell-100-goto](https://maximilianocontieri.com/code-smell-100-goto)