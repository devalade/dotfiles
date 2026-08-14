# Code Smell 19 - Optional Arguments

Disguised as a friendly shortcut is another coupling smell.

**TL;DR:** Optional Arguments generate a hidden coupling in the name of smaller code.

## Problems

- Coupling

- Unexpected results

- Side effects

- Ripple Effect

- In languages with optional arguments but limited to basic types, we need to set a flag and add an accidental IF (another smell).

## Solutions

- Make arguments explicit.
- All function calls must have the same arity.
- Use Named Parameters if your language supports them.

## Sample Code

##### Wrong

```
<?

final class Poll {

    function _construct(array $questions, bool $annonymousAllowed = false, $validationPolicy = 'Normal') {

        if ($validationPolicy == 'Normal') {
          $validationPolicy = new NormalValidationPolicy();
        }
        //...
    }
}

//Valid
new Poll([]);
new Poll([], true);
new Poll([], true , new NormalValidationPolicy());
new Poll([], , new StrictValidationPolicy());

```

##### Right

```
<?

final class Poll {

    function _construct(array $questions, AnonnyomousStrategy $annonymousStrategy, ValidationPolicy $validationPolicy) {
        //...
    }
}

//invalid
new Poll([]);
new Poll([], new NoAnonnyomousValidStrategy());
new Poll([], , new StrictValidationPolicy());

//Valid
new Poll([], new NoAnonnyomousValidStrategy(), new StrictValidationPolicy());

```

## Detection

Detection is easy if the language supports optional arguments.

## Tags

- Optional

- Laziness

## Conclusion

Be explicit. Favor readability over shorter (and more coupled) function calls.