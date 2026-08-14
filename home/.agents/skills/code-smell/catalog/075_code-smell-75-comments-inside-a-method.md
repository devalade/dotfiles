# Code Smell 75 - Comments Inside a Method

**TL;DR:** Don't add comments inside your methods. Extract them and leave declarative comments just for not obvious design decisions.

## Problems

- Readability

- Kiss

- Low Reuse

- Bad Documentation

## Solutions

- Extract Method

- Refactor

- Remove not declarative comments.

## Sample Code

##### Wrong

```
function recoverFromGrief() {
    // Denial stage
    absorbTheBadNews();
    setNumbAsProtectiveState();
    startToRiseEmotions();
    feelSorrow();

    // Anger stage
    maskRealEffects();
    directAngerToOtherPeople();
    blameOthers();
    getIrrational();

    // bargaining stage
    feelVulnerable();
    regret();
    askWhyToMyself();
    dreamOfAlternativeWhatIfScenarios();
    postoponeSadness();

    // depression stage
    stayQuiet();
    getOverwhelmed();
    beConfused();

    // acceptance stage
    acceptWhatHappened();
    lookToTheFuture();
    reconstructAndWalktrough();
}

```

##### Right

```
function recoverFromGrief() {
    denialStage();
    angerStage();
    bargainingStage();
    depressionStage();
    acceptanceStage();
}

function denialStage() {
    absorbTheBadNews();
    setNumbAsProtectiveState();
    startToRiseEmotions();
    feelSorrow();
}

function angerStage() {
    maskRealEffects();
    directAngerToOtherPeople();
    blameOthers();
    getIrrational();
}

function bargainingStage() {
    feelVulnerable();
    regret();
    askWhyToMyself();
    dreamOfAlternativeWhatIfScenarios();
    postoponeSadness();
}

function depressionStage() {
    stayQuiet();
    getOverwhelmed();
    beConfused();
}

function acceptanceStage() {
    acceptWhatHappened();
    lookToTheFuture();
    reconstructAndWalktrough();
}

```

## Detection

This is a policy smell. Every linter can detect comments not present in the first line and warn us.

Tip: (Thanks @GreenFieldCoder)

To get rid of comments fast, change your IDE to display comments with red background and yellow text. It will literally scream refactor me when browsing the code.

Also prevents you from writing new comments.

## Tags

- Readability

- Long Methods

- Comments

## Conclusion

Comments are a code smell. If you need to document a design decision, you should do it before the actual method code.

## Relations

[https://maximilianocontieri.com/code-smell-03-functions-are-too-long](https://maximilianocontieri.com/code-smell-03-functions-are-too-long)
[https://maximilianocontieri.com/code-smell-74-empty-lines](https://maximilianocontieri.com/code-smell-74-empty-lines)
[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)