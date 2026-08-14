# Code Smell 46 - Repeated Code

DRY is our mantra. Teachers tell us to remove duplication. We need to go beyond.

## Problems

- Code Duplication

- Maintainability

- Don't Repeat Yourself

## Solutions

- Find repeated patterns (not repeated code).

- Create an abstraction.

- Parametrize abstraction calls.

- Use composition and never inheritance.

- Unit test new abstraction.

## Sample Code

##### Wrong

```
<?

final class WordProcessor {

    function replaceText(string $patternToFind, string $textToReplace) {
        $this->text = '<<<' . str_replace($patternToFind, $textToReplace, $this->text) . '>>>';
    }
}

final class Obfuscator {

    function obfuscate(string $patternToFind, string $textToReplace) {
        $this->text = strlower(str_ireplace($patternToFind, $textToReplace, $this->text));
    }
}

```

##### Right

```
<?

final class TextReplacer {
    function replace(string $patternToFind, string $textToReplace, string $subject, string $replaceFunctionName, $postProcessClosure) {
        return $postProcessClosure($replaceFunctionName($patternToFind, $textToReplace, $subject));
    }
}

// Lots of tests on text replacer so we can gain confidence.

final class WordProcessor {

    function replaceText(string $patternToFind, string $textToReplace) {
        $this->text = (new TextReplacer())->replace($patternToFind, $textToReplace, $this->text, 'str_replace', fn($text) => '<<<' . $text . '>>>');
    }
}

final class Obfuscator {

    function obfuscate(string $patternToFind, string $textToReplace) {
        $this->text = (new TextReplacer())->replace($patternToFind, $textToReplace, $this->text, 'str_ireplace', fn($text) => strlower($text));
    }
}

```

## Detection

Linters can find repeated code.

There are not very good finding similar patterns.

Maybe soon machine learning will help us find such abstractions automatically.

For now, it is up to us, humans.

## Tags

- Duplication

## Conclusion

Repeated code is always a smell.

Copying and pasting code is always a shame.

With our refactoring tools, we need to accept the duplication remove challenge trusting our tests as a safety net.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)