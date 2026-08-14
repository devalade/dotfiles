# Code Smell 254 - Mystery Guest

**TL;DR:** Be explicit when creating tests to ensure clarity and maintainability

## Problems

- Readability

- Coupling to external databases, global state or singletons, static methods or external services

- Maintenance Difficulty

- Debugging Complexity

- Hidden Dependencies

## Solutions

- Be Explicit

- Inline the setup

- Use dependency Injection

- Use mocking with caution

## Sample Code

##### Wrong

```
@Test
void shouldReturnAnswerWhenAnswerExists() {
    User answer = KnowledgeRepository.findAnswerToQuestion(42);
    assertNotNull(answer);
}

```

##### Right

```
@Test
void shouldReturnAnswerWhenAnswerExists() {
    KnowledgeRepository knowledgeRepository =
        new InMemoryKnowledgeRepository();
    Answer expectedAnswer = new Answer(42, "The Ultimate");
    knowledgeRepository.save(expectedAnswer);

    Answer actualAnswer = answerRepository.findAnswerToQuestion(42);
    assertNotNull(actualAnswer);
    assertEquals(expectedAnswer, actualAnswer);
}

```

## Detection

[X]  Manual

You can detect this smell by looking for tests that do not clearly show their setup steps or rely heavily on external configurations.

## Tags

- Test Smells

## Conclusion

This code smell is especially prevalent in legacy codebases or when consistent testing practices are lacking.

You need to be explicit about the environment since tests must always be in "full environmental control"

## Relations

[https://maximilianocontieri.com/code-smell-17-global-functions](https://maximilianocontieri.com/code-smell-17-global-functions)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)
[https://maximilianocontieri.com/code-smell-30-mocking-business](https://maximilianocontieri.com/code-smell-30-mocking-business)