# Code Smell 111 - Modifying Collections While Traversing

Changing a collection while traversing might lead to unexpected errors

**TL;DR:** Do not modify collections while traversing them

## Problems

- Unexpected Results

- Concurrency problems

## Solutions

- Avoid altering the collections

- Make collection copies

## Sample Code

##### Wrong

```
Collection<Integer> people = new ArrayList<>();
//here we add elements to the collection...

for (Object person : people) {
    if (condition(person)) {
        people.remove(person);
    }
}
//We iterate AND remove elements

```

##### Right

```
Collection<Integer> people = new ArrayList<>();
//here we add elements to the collection...

List<Object> iterationPeople = ImmutableList.copyOf(people);

for (Object person : iterationPeople) {
    if (condition(person)) {
        people.remove(person);
    }
}
//We iterate a copy and remove from original

coll.removeIf(currentIndex -> currentIndex == 5);
//Or use language tools (if available)

```

## Detection

[X] Semi Automatic

Many languages provide control both in compile and run time-

## Tags

- Fail Fast

## Conclusion

This is something we learn in our first courses.

It happens a lot in the industry and real-world software

## Relations

[https://maximilianocontieri.com/code-smell-53-explicit-iteration](https://maximilianocontieri.com/code-smell-53-explicit-iteration)