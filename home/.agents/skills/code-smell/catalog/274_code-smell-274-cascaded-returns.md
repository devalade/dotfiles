# Code Smell 274 - Cascaded Returns

Remember: AI Assistants make lots of mistakes

**TL;DR:** Prevent chaining return statements for better code readability and flow.

## Problems

- Confusing flow
- Hard to debug
- Buried logic
- Low readability
- Risk of errors
- Abuse of IF Sentences

## Solutions

- Early returns
- Clear conditions
3 Use guard clauses
4 Repace IFs with Polymorphism

## Sample Code

##### Wrong

```
function discount(price, isMember) {
  if (price < 20) {
    if (isMember) {
      return 5;
    } else {
      return 2;
    }
  } else {
    if (isMember) {
      return 10;
    } else {
      return 0;
    }
  }
}

```

##### Right

```
class Member {
  discount(price) {
    return price < 20 ? 5 : 10;
    // This ternary is an essential IF
    // And you should NOT remove it
  }
}

class NonMember {
  discount(price) {
    return price < 20 ? 2 : 0;
    // This ternary is an essential IF
    // And you should NOT remove it
  }
}

function discount(price, status) {
  return status.discount(price);
}

const member = new Member();
const nonMember = new NonMember();

```

## Detection

[X] Automatic

You can spot cascaded returns by looking for multiple nested return statements.

If you see deep indentation or many layers of conditions, that's a sign of this code smell.

## Tags

- IF

## Conclusion

Avoid cascaded returns to make your code more readable, maintainable, and easier to debug.

Stick to early returns and guard clauses to prevent unnecessary complexity.

## Relations

[https://maximilianocontieri.com/code-smell-119-stairs-code](https://maximilianocontieri.com/code-smell-119-stairs-code)
[https://maximilianocontieri.com/code-smell-102-arrow-code](https://maximilianocontieri.com/code-smell-102-arrow-code)
[https://maximilianocontieri.com/code-smell-78-callback-hell](https://maximilianocontieri.com/code-smell-78-callback-hell)
[https://maximilianocontieri.com/code-smell-156-implicit-else](https://maximilianocontieri.com/code-smell-156-implicit-else)