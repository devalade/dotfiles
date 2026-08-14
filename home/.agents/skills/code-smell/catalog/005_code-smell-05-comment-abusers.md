# Code Smell 05 - Comment Abusers

**TL;DR:** Leave comments just for important design decisions. Don't explain the obvious.

## Problems

- Maintainability

- Obsolete Documentation

- Readability

- Code and comments duplication.

## Solutions

1) Refactor methods.

2) Rename methods to more declarative ones.

3) Break methods.

4) If a comment describes what a method does, name the method with this description.

5) Just comment on important design decisions.

https://maximilianocontieri.com/what-exactly-is-a-name-part-i-the-quest

## Sample Code

##### Wrong

```
<?

final class ChatBotConnectionHelper {
    // ChatBotConnectionHelper is used to create connection strings to Bot Platform
    // Use this class with getString() function to get connection string to platform

    public $id; // ChatBot Id

    function getId() { // Gets id value
    }

    function setId($id) { // Sets id value
    }

    function getString() {
        // Get Connection String from Chatbot
        // ....
    }
}

```

##### Right

```
<?

final class ChatBotConnectionSequenceGenerator {

    private $name;

    function connectionSequence() {
        // ....
    }
}

```

## Detection

Linters can detect comments and check the ratio of comments/lines of code against a predefined threshold.

## Tags

- Comments

- Declarative

## Conclusion

Leave comments just for important design decisions. Don't comment on a method with a bad name, rename it.

## Relations

[https://maximilianocontieri.com/code-smell-75-comments-inside-a-method](https://maximilianocontieri.com/code-smell-75-comments-inside-a-method)