# Code Smell 175 - Changes Without Coverage

If your merge request has no test changed, you haven't finished your job

**TL;DR:** Don't change the code without breaking some tests.

## Problems

- Quality

- Maintainability

## Solutions

- Cover your code.

## Exceptions

If your code and your tests harness live in different repositories, you might have different pull requests.

## Sample Code

##### Wrong

```
export function sayHello(name: string): string {
  const lengthOfName = name.length;
-  const salutation = `How are you ${name}?, I see your name has ${lengthOfName} letters!`;
+  const salutation = `Hello ${name}, I see your name has ${lengthOfName} letters!`;
  return salutation;
}

```

##### Right

```
export function sayHello(name: string): string {
  const lengthOfName = name.length;
-  const salutation = `How are you ${name}?, I see your name has ${lengthOfName} letters!`;
+  const salutation = `Hello ${name}, I see your name has ${lengthOfName} letters!`;
  return salutation;
}

import { sayHello } from './hello';

test('given a name produces the expected greeting', () => {
  expect(sayHello('Alice')).toBe(
    'Hello Alice, I see your name has 6 letters!'
  );
});

```

## Detection

[X] Automatic

We can ensure all our merge requests include test code.

## Tags

- Quality

## Conclusion

Test coverage is as important as functional code.

The test system is our first and more loyal customer.

We need to care for them.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)