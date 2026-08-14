# Code Smell 90 - Implementative Callback Events

When creating events, we should decouple the trigger from the action.

**TL;DR:** Name your functions according to what happened.

## Problems

- Observer Pattern violation

- Coupling

## Solutions

- Name the events after "what happened", not "what you should do"

## Sample Code

##### Wrong

```
const Item = ({name, handlePageChange)} =>
  <li onClick={handlePageChange}>
    {name}
  </li>

// handlePageChange is coupled with what you decide to do
/ /instead of what really happened
//
// We cannot reuse this kind of callback

```

##### Right

```
const Item = ({name, onItemSelected)} =>
  <li onClick={onItemSelected}>
    {name}
  </li>

// onItemSelected will be called just when an item was selected. KISS
// Parent can decide what to do (or do nothing)
// We defer the decision

```

## Detection

This is a semantic smell. We can detect it on peer code reviews.

## Tags

- Coupling

- Naming

## Conclusion

Names are very important. We should delay implementation coupled names until the very last moment.