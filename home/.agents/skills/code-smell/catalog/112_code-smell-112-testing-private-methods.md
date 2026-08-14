# Code Smell 112 - Testing Private Methods

**TL;DR:** Don't test your private methods.

## Problems

- Breaking Encapsulation

- Code Duplication

## Solutions

- If your method is simple, you don't need to test it.

- If your method is complicated, you need to convert it into a Method Object.

- Do not make your methods public for testing.

- Do not use metaprogramming to avoid protection.

- Do not move the private computation to helpers.

- Do not use static methods for computations.

## Sample Code

##### Wrong

```
<?

final class Star {

  private $distanceInParsecs;

  public function timeToReachLightToUs() {
    return $this->convertDistanceInParsecsToLightYears($this->distanceInParsecs);
  }

  private function convertDistanceInParsecsToLightYears($distanceInParsecs) {
      return 3.26 * $distanceInParsecs;
      // function is using an argument that is already available.
      // since it has private access to $distanceInParsecs
      // this is another smell indicator.

      // We cannot test this function since it is private
  }
}

```

##### Right

```
<?

final class Star {

  private $distanceInParsecs;

  public function timeToReachLightToUs() {
    return new ParsecsToLightYearsConverter($this->distanceInParsecs);
  }
}

final class ParsecsToLightYearsConverter {
  public function convert($distanceInParsecs) {
      return 3.26 * $distanceInParsecs;
  }
}

final class ParsecsToLightYearsConverterTest extends TestCase {
  public function testConvert0ParsecsReturns0LightYears() {
    $this->assertEquals(0, (new ParsecsToLightYearsConverter)->convert(0));
  }
    // we can add lots of tests and rely on this object
    // So we don't need to test Star conversions.
    // We can yet test Star public timeToReachLightToUs()
    // This is a simplified scenario

}

```

## Detection

[X] Semi-Automatic

This is a semantic smell.

We can only find metaprogramming abuse on some unit frameworks.

## Tags

- Test Smells

## Conclusion

With this guide, we should always choose the method object solution.

## Relations

[https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers](https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers)
[https://maximilianocontieri.com/code-smell-22-helpers](https://maximilianocontieri.com/code-smell-22-helpers)
[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)