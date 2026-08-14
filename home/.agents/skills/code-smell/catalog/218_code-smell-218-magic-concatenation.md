# Code Smell 218 - Magic Concatenation

**TL;DR:** Watch out for fancy language assumptions

## Problems

- Possible defects

- The least surprise principle violation

- Hidden Assumptions

## Solutions

- Be declarative

- Use good linters

- Prefer declarative languages

## Sample Code

##### Wrong

```
tools = [
    "Amazon Codewhisperer",
    "Bard" # Notice the missing comma
    "ChatGPT",
    "Dalle-E" # Also here
    "Eliza"
    ]

print(len(tools))
# This will output 3

print(tools)
# ['Amazon Codewhisperer', 'BardChatGPT', 'Dalle-EEliza']
# Missing Commas act as hidden string concatenators

```

##### Right

```
tools = [
    "Amazon Codewhisperer",
    "Bard",
    "ChatGPT",
    "Dalle-E",
    "Eliza"
]

# We added all the missing commas

print(len(tools))
# 5

print(tools)
# ['Amazon Codewhisperer', 'Bard', 'ChatGPT', 'Dalle-E', 'Eliza']

```

## Detection

[X] Semi-Automatic

Many linters warn about this problem. Also, ChatGPT and Bard can detect the problem.

## Tags

- Readability

## Conclusion

Many modern programming languages come with a significant amount of accidental complexity.

They are often optimized for writing code quickly, even though they may be prone to defects.

Unfortunately, when working with these languages, it is essential to exercise extreme caution.

## Relations

[https://maximilianocontieri.com/code-smell-84-max-less-min-javascript](https://maximilianocontieri.com/code-smell-84-max-less-min-javascript)

[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)

[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)