# Code Smell 93 - Send me Anything

Magic functions that can receive a lot of different (and not polymorphic arguments)

**TL;DR:** Create a clear contract. Expect just one protocol.

## Problems

- Fail Fast principle violation

- Error prune

- Readability

- If polluting

- Nulls

- Bad Cohesion

## Solutions

- Take just one "kind" of input

- Arguments should adhere to a single protocol.

## Sample Code

##### Wrong

```
<?

function parseArguments($arguments) {
    $arguments = $arguments ?: null;
    //Always the billion-dollar mistake
    if (is_empty($arguments)) {
        $this->arguments = http_build_query($_REQUEST);
        //Global coupling and side effects
    } elseif (is_array($arguments)) {
        $this->arguments = http_build_query($arguments);
    } elseif (!$arguments) { //null unmasked
        $this->arguments = null;
    } else {
        $this->arguments = (string)$arguments;
    }
}

```

##### Right

```
<?

function parseArguments(array $arguments) {
    $this->arguments = $arguments;
    //much cleaner, isn't it ?
}

```

## Detection

We can detect this kind of method when they do different things, asking for the argument kind.

## Tags

- If Polluter

## Conclusion

Magic castings and flexibility have a price. They put the rubbish under the rug and violate the fail fast principle.

## Relations

[https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings](https://maximilianocontieri.com/code-smell-69-big-bang-javascript-ridiculous-castings)
[https://maximilianocontieri.com/code-smell-06-too-clever-programmer](https://maximilianocontieri.com/code-smell-06-too-clever-programmer)
[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)