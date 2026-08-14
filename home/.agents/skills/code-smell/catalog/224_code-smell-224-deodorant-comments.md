# Code Smell 224 - Deodorant Comments

**TL;DR:** Don't excuse bad code. Write a clean one!

## Problems

- Readability

## Solutions

- Rewrite the code and delete the comment

## Exceptions

- Comments should only be used to describe important design decisions.

## Sample Code

##### Wrong

```
# This is a function that adds two numbers
def s(a, b):
    # Now you are going to add a and b
    res = a + b
    # And return the result
    return res

```

##### Right

```
def sum(adder, anotherAdder):

    return adder + anotherAdder

```

If you ask ChatGPT to improve this version it will actually worsen it:

```
def calculate_sum(number1, number2):
    # Calculate the sum of two numbers
    result = number1 + number2
    return result

#In this improved version:
#
# The function name calculate_sum is more descriptive than sum,
# making it clear that this function calculates the sum of two numbers.
# (Wrong) it is more imperative and mistakes the 'what' with the 'how'
#
# The parameter names number1 and number2 are more meaningful
# than adder and anotherAdder, helping to indicate the purpose of each parameter.
# (wrong) They indicate type instead of role
#
# The comment # Calculate the sum of two numbers provides a clear
# and concise explanation of what the function does,
# making it easier for someone reading the code to understand its purpose.
# (wrong) in fact, it is an example of deodorant and useless comment

```

## Detection

[X] Semi-Automatic

Most comments are code smells.

You can remove deodorant comments and improve the code.

## Tags

- Comments

## Conclusion

Remove any meaningless comment you find in your code.

## Relations

[https://maximilianocontieri.com/code-smell-151-commented-code](https://maximilianocontieri.com/code-smell-151-commented-code)
[https://maximilianocontieri.com/code-smell-183-obsolete-comments](https://maximilianocontieri.com/code-smell-183-obsolete-comments)
[https://maximilianocontieri.com/code-smell-146-getter-comments](https://maximilianocontieri.com/code-smell-146-getter-comments)
[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)
[https://maximilianocontieri.com/refactoring-011-replace-comments-with-tests](https://maximilianocontieri.com/refactoring-011-replace-comments-with-tests)