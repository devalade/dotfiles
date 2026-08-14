# Code Smell 257 - Name With Collections

**TL;DR:** Drop "collection" prefix for clarity.

## Problems

- Redundant Naming

- Verbose Code

- Reduced Readability

- Refactoring Challenges

- Coupled to implementation

## Solutions

- Use Simple Names

- Remove 'collection' from the name

- Use plural names without the word 'collection'

## Sample Code

##### Wrong

```
struct Task {
    collection_of_subtasks: Vec<Subtask>,
    subtasks_collection: Vec<Subtask>,
}

impl Task {
    fn add_subtask(&mut self, subtask: Subtask) {
        self.collection_of_subtasks.push(subtask);
        self.subtasks_collection.push(subtask);
    }
}

```

##### Right

```
struct Task {
    subtasks: Vec<Subtask>,
}

impl Task {
    fn add_subtask(&mut self, subtask: Subtask) {
        self.subtasks.push(subtask);
    }
}

```

## Detection

[X] Automatic

You can add rules to your linter preventing these redundant names.

## Tags

- Naming

## Conclusion

Simplifying property names by removing prefixes like "collection" leads to more readable and maintainable code.

It would be best to focus on clear, direct names that communicate the purpose without redundancy.

## Relations

[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)
[https://maximilianocontieri.com/code-smell-171-plural-classes](https://maximilianocontieri.com/code-smell-171-plural-classes)
[https://maximilianocontieri.com/code-smell-113-data-naming](https://maximilianocontieri.com/code-smell-113-data-naming)