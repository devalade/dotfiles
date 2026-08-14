# Code Smell 54 - Anchor Boats

## Problems

- Complexity

- Coupling

## Solutions

- Remove dead code.

- Leave covered and real tested code.

## Sample Code

##### Wrong

```
<?

final class DatabaseQueryOptimizer {

  public function selectWithCriteria($tableName, $criteria) {
    //Make some optimizations manipulating criteria
  }

  private function sqlParserOptimization(SQLSentence $sqlSentence): SQLSentence {
    //Parse the SQL converting it to a string and then working with their nodes as strings and lots of regex
    //This was a very costly operation overcoming real SQL benefits.
    //But since we made too much work we decide to keep the code.
  }
}

```

##### Right

```
<?

final class DatabaseQueryOptimizer {

  public function selectWithCriteria($tableName, $criteria) {
    //Make some optimizations manipulating criteria
  }
}

```

## Detection

Using some mutation testing variants we can remove the dead code and see if test fails.

We need to have good coverage to rely on this solution.

## Tags

- YAGNI

## Conclusion

Dead code is always a problem.

We can use modern development techniques like TDD to ensure all code is alive.

https://maximilianocontieri.com/how-to-squeeze-test-driven-development-on-legacy-systems

## Also Known As

>Also Known as

- Speculative Generality

## Relations

[https://maximilianocontieri.com/code-smell-09-dead-code](https://maximilianocontieri.com/code-smell-09-dead-code)