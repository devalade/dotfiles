# Code Smell 82 - Tests Violating Encapsulation

Objects work fine and fulfill business objectives. But we need to test them. Let's break them.

**TL;DR:** Don't write methods with the only purpose of being used in your tests.

## Problems

- Encapsulation Violation.

- Bad interfaces

- Coupling

## Solutions

- Don't break encapsulation.

- Test must be in full control.

- If you cannot control your object, you are coupled. Decouple them!

## Sample Code

##### Wrong

```
<?

class Hangman {
    private $wordToGuess;

    function __construct() {
        $this->wordToGuess = getRandomWord();
        //Test is not in control of this
    }

    public function getWordToGuess(): string {
        return $this->wordToGuess;
        //Sadly we need to reveal this
    }
}

class HangmanTest extends TestCase {
    function test01WordIsGuessed() {
        $hangmanGame = new Hangman();
        $this->assertEquals('tests', $hangmanGame->wordToGuess());
        //how can we make sure the word is guessed?
    }
}

```

##### Right

```
<?

class Hangman {
    private $wordToGuess;

    function __construct(WordRandomizer $wordRandomizer) {
        $this->wordToGuess = $wordRandomizer->newRandomWord();
    }
}

class MockRandomizer implements WordRandomizer {
    function newRandomWord(): string {
        return 'tests';
    }
}

class HangmanTest extends TestCase {
    function test01WordIsGuessed() {
        $hangmanGame = new Hangman(new MockRandomizer());
        //We are in full control!
        $this->assertFalse($hangmanGame->wordWasGuessed());
        $hangmanGame->play('t');
        $this->assertFalse($hangmanGame->wordWasGuessed());
        $hangmanGame->play('e');
        $this->assertFalse($hangmanGame->wordWasGuessed());
        $hangmanGame->play('s');
        $this->assertTrue($hangmanGame->wordWasGuessed());
        //We just test behavior
    }
}

```

## Detection

This is a design smell.

We can detect we need a method just for test.

## Tags

- Information Hiding

## Conclusion

White-box tests are fragile. They test implementation instead of behavior.

## Relations

[https://maximilianocontieri.com/code-smell-52-fragile-tests](https://maximilianocontieri.com/code-smell-52-fragile-tests)
[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)