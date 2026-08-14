# Code Smell 104 - Assert True

Asserting against booleans makes error tracking more difficult.

**TL;DR:** Don't assert true unless you are checking a boolean

## Problems

- Fail Fast Principle

## Solutions

- Check if the boolean condition can be rewritten better

- Favor assertEquals

## Sample Code

##### Wrong

```
<?

final class RangeUnitTest extends TestCase {

  function testValidOffset() {
    $range = new Range(1, 1);
    $offset = $range->offset();
    $this->assertTrue(10 == $offset);
    //No functional essential description :(
    //Accidental description provided by tests is very bad
  }
}

// When failing Unit framework will show us
//
// 1 Test, 1 failed
// Failing asserting true matches expected false :(
// () <-- no business description :(
//
// <Click to see difference> - Two booleans
// (and a diff comparator will show us two booleans)

```

##### Right

```
<?

final class RangeUnitTest extends TestCase {

  function testValidOffset() {
    $range = new Range(1, 1);
    $offset = $range->offset();
    $this->assertEquals(10, $offset, 'All pages must have 10 as offset');
    //Expected value should always be first argument
    //We add a functional essential description
    //to complement accidental description provided by tests
  }
}

// When failing Unit framework will show us
//
// 1 Test, 1 failed
// Failing asserting 0 matches expected 10
// All pages must have 10 as offset <-- business description
//
// <Click to see difference>
// (and a diff comparator will help us and it will be a great help
// for complex objects like objects or jsons)

```

## Detection

[X] SemiAutomatic

Some linters warn us if we are checking against boolean after setting this condition.

We need to change it to a more specific check.

## Tags

- Test Smells

## Conclusion

Try to rewrite your boolean assertions and you will fix the failures much faster.

## Relations

[https://maximilianocontieri.com/code-smell-101-comparison-against-booleans](https://maximilianocontieri.com/code-smell-101-comparison-against-booleans)
[https://maximilianocontieri.com/code-smell-07-boolean-variables](https://maximilianocontieri.com/code-smell-07-boolean-variables)