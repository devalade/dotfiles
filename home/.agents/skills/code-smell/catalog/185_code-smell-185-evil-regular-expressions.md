# Code Smell 185 - Evil Regular Expressions

Service

**TL;DR:** Try to minimize Regular Expression's recursive rules.

## Problems

- Security Issues

- Readability

- Premature Optimization

## Solutions

- Cover the cases with tests to see if they halt

- Use algorithms instead of regular expressions

- Add timeout handlers

## Sample Code

##### Wrong

```
package main

import (
    "regexp"
    "fmt"
)

func main() {
    var re = regexp.MustCompile(`^(([a-z])+.)+[A-Z]([a-z])+$`)
    var str = `aaaaaaaaaaaaaaaaaaaaaaaa!`

    for i, match := range re.FindAllString(str, -1) {
        fmt.Println(match, "found at index", i)
    }
}

```

##### Right

```
package main

import (
    "fmt"
    "strings"
)

func main() {
    var str = `aaaaaaaaaaaaaaaaaaaaaaaa!`

    words := strings.Fields(str)

    for i, word := range words {
        if len(word) >= 2 && word[0] >= 'a' && word[0] <= 'z' && word[len(word)-1] >= 'A'
          && word[len(word)-1] <= 'Z' {
            fmt.Println(word, "found at index", i)
        }
    }
}

```

## Detection

[X] Semi-Automatic

Many languages avoid this kind of regular expression.

We can also scan the code for this vulnerability.

## Tags

- Security

## Conclusion

Regular Expressions are tricky and hard to debug.

We should avoid them as much as possible.

## Relations

[https://maximilianocontieri.com/code-smell-41-regular-expression-abusers](https://maximilianocontieri.com/code-smell-41-regular-expression-abusers)