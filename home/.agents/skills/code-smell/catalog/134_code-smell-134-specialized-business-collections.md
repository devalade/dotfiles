# Code Smell 134 - Specialized Business Collections

**TL;DR:** Don't create unnecessary abstractions

## Problems

- Over Design

- Unneeded classes

## Solutions

- Use a standard class

## Exceptions

Sometimes we need to optimize collections for performance reasons if we have enough strong evidence.

## Sample Code

##### Wrong

```
<?php

Namespace Spelling;

final class Dictionary {

    private $words;
    function __construct(array $words) {
        $this->words = $words;
    }

    function wordsCount(): int {
        return count($this->words);
    }

    function includesWord(string $subjectToSearch): bool {
        return in_array($subjectToSearch, $this->words);
    }
}

//This has protocol similar to an abstract datatype dictionary
//And the tests

use PHPUnit\Framework\TestCase;

final class DictionaryTest extends TestCase {
    public function test01EmptyDictionaryHasNoWords() {
        $dictionary = new Dictionary([]);
        $this->assertEquals(0, $dictionary->wordsCount());
    }

    public function test02SingleDictionaryReturns1AsCount() {
        $dictionary = new Dictionary(['happy']);
        $this->assertEquals(1, $dictionary->wordsCount());
    }

    public function test03DictionaryDoesNotIncludeWord() {
        $dictionary = new Dictionary(['happy']);
        $this->assertFalse($dictionary->includesWord('sadly'));
    }

    public function test04DictionaryIncludesWord() {
        $dictionary = new Dictionary(['happy']);
        $this->assertTrue($dictionary->includesWord('happy'));
    }
}

```

##### Right

```
<?php

Namespace Spelling;

// final class Dictionary is no longer needed

//The tests use a standard class
//In PHP we use associative arrays
//Java an other languages have HashTables, Dictionaries etc. etc.

use PHPUnit\Framework\TestCase;

final class DictionaryTest extends TestCase {
    public function test01EmptyDictionaryHasNoWords() {
        $dictionary = [];
        $this->assertEquals(0, count($dictionary));
    }

    public function test02SingleDictionaryReturns1AsCount() {
        $dictionary = ['happy'];
        $this->assertEquals(1, count($dictionary));
    }

    public function test03DictionaryDoesNotIncludeWord() {
        $dictionary = ['happy'];
        $this->assertFalse(in_array('sadly', $dictionary));
    }

    public function test04DictionaryIncludesWord() {
        $dictionary = ['happy'];
        $this->assertTrue(in_array('happy', $dictionary));
    }
}

```

## Detection

[X] SemiAutomatic

Based on protocols, we should remove some unnecessary classes

## Tags

- Protocols

## Conclusion

We need to clean up code from time to time.

Specialized collections are a good starting point.

## Relations

[https://maximilianocontieri.com/code-smell-111-modifying-collections-while-traversing](https://maximilianocontieri.com/code-smell-111-modifying-collections-while-traversing)