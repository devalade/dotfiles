# Code Smell 59 - Basic / Do Functions

sort, doSort, basicSort, doBasicSort, primitiveSort, superBasicPrimitiveSort, who does the real work?

**TL;DR:** Shortcuts for mini wrappers shout for better solutions.

## Problems

- Readability

- Bad Naming

- Low Cohesion

- Single Responsibility Principle

## Solutions

- Use good object wrappers

- Use dynamic decorators

## Sample Code

##### Wrong

```
<?

final class Calculator {

    private $cachedResults;

    function computeSomething() {
        if (isset($this->cachedResults)) {
            return $this->cachedResults;
        }
        $this->cachedResults = $this->logAndComputeSomething();
    }

    private function logAndComputeSomething() {
        $this->logProcessStart();
        $result = $this->basicComputeSomething();
        $this->logProcessEnd();
        return $result;
    }

    private function basicComputeSomething() {
        /// Do Real work here
    }

}

```

##### Right

```
<?

final class Calculator {
    function computeSomething() {
        // Do Real work here since I am Compute!
    }
}

//Clean and cohesive class, single responsibility

final class CalculatorDecoratorCache {

    private $cachedResults;
    private $decorated;

    function computeSomething() {
        if (isset($this->cachedResults)) {
            return $this->cachedResults;
        }
        $this->cachedResults = $this->decorated->computeSomething();
    }
}

final class CalculatorDecoratorLogger {

    private $decorated;

    function computeSomething() {
        $this->logProcessStart();
        $result = $this->decorated->computeSomething();
        $this->logProcessEnd();
        return $result;
    }
}

```

## Detection

We can instruct our static linters to find wrapping methods if they follow conventions like doXXX(), basicXX() etc.

## Tags

- Declarativiness

## Conclusion

We came across this kind of method some time in our developer life, We smelled something was not OK with them. Now is the time to change them!