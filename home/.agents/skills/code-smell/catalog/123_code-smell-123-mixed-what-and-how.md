# Code Smell 123 - Mixed 'What' and 'How'

We love looking at the internal gears of the clock, but we need to start focusing on the hands.

**TL;DR:** Don't mess with implementation details. Be declarative. Not imperative.

## Problems

- Accidental Coupling

- Coupling

- Lack of design for change

- Comments distinguish the 'how' and the 'what'.

## Solutions

- Separate 'What' and 'How' concerns.

## Sample Code

##### Wrong

```
class Workflow {
    moveToNextTransition() {
        // We couple the business rule with the accidental implementation
        if (this.stepWork.hasPendingTasks) {
            throw new Exception('Preconditions are not met yet..');
        } else {
            this.moveToNextStep();
        }
    }
}

```

##### Right

```
class Workflow {
    moveToNextTransition() {
        if (!this.canWeMoveOn()) {
            throw new Exception('Preconditions are not met yet..');
        } else {
            this.moveToNextStep();
        }
    }

    canWeMoveOn() {
        // We hide accidental implementation 'the how'
        // under the 'what'
        return !this.stepWork.hasPendingTasks();
    }
}

```

## Detection

[X] Manual

This is a semantic and naming smell.

## Tags

- Readability

## Conclusion

We need to choose good names and add indirection layers when necessary.

Of course, premature optimizators will fight us, telling us we are wasting computational resources and they need to know the insights we are hiding from them.

## Relations

[https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names](https://maximilianocontieri.com/code-smell-92-isolated-subclasses-names)
[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)