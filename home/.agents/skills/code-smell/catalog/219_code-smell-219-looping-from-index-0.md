# Code Smell 219 - Looping from index 0

**TL;DR:** Start counting from one instead of zero. Like humans do.

## Problems

- Bijection from real-world broken

- Cognitive load

- Overly implementation-oriented code

## Solutions

- Favor high-level declarative languages

## Exceptions

- Low-level optimized code

## Sample Code

##### Wrong

```
package main

import "fmt"

func main() {
    numbers := []int{10, 20, 30, 40, 50}

    for i := 0; i < len(numbers); i++ {
        // Iteration goes from zero to len-1
        fmt.Println(numbers[i])
    }
}

```

##### Right

```
numbers = [10, 20, 30, 40, 50];

% Looping through the array using one-based indexing
% from 1 to length
for currentIndex = 1:length(numbers)
    disp(numbers(currentIndex));
end

```

## Detection

[X] Automatic

This is a language smell.

## Tags

- Declarative Code

## Conclusion

We need to think as humans when we code and not as machines.

Humans count from one.

Zero number was a brilliant discovery in math and science but it does not apply to everyday counting.

## Relations

[https://maximilianocontieri.com/code-smell-53-explicit-iteration](https://maximilianocontieri.com/code-smell-53-explicit-iteration)

[https://maximilianocontieri.com/code-smell-123-mixed-what-and-how](https://maximilianocontieri.com/code-smell-123-mixed-what-and-how)