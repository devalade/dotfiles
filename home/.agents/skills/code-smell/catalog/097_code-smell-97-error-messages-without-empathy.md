# Code Smell 97 - Error Messages Without Empathy

We should take special care with error descriptions for the users (and ourselves).

**TL;DR:** Use meaningful descriptions and suggest corrective actions.

## Problems

- The Least Surprise Principle

## Solutions

- Use declarative error messages

- Show clear exit actions

## Sample Code

##### Wrong

```
alert("Cancel the appointment?", "Yes", "No");

//No consequences
//Options not clear

```

##### Right

```
alert("Cancel the appointment? \n" +
      "You will lose all the history",
      "Cancel Appointment",
      "Keep Editing");

//Consequences are clear
//Choice options have context

```

## Detection

[X] Manual

We need to read all exception messages in code reviews.

## Tags

- Exceptions

- UX

## Conclusion

We need to think in our end users when raising exception or showing messages.