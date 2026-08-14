# Code Smell 55 - Object Orgy

If you see your objects as data holders you will violate their encapsulation, but you shouldn't, as in real life, you should always ask for consent.

**TL;DR:** Don't mess with other object's data.

## Problems

- Information Hiding Violation

- Encapsulation Violation

- Coupling

## Solutions

- Couple to interfaces and behavior, never data.

## Sample Code

##### Wrong

```
<?

final class Point {
    public $x;
    public $y;
}

final class DistanceCalculator {
    function distanceBetween(Point $origin, Point $destination) {
        return sqrt((($destination->x - $origin->x) ^ 2) + (($destination->y - $origin->y) ^ 2));
    }
}

```

##### Right

```
<?

final class Point {
    private $rho;
    private $theta;

    public function x() {
        return $this->rho * cos($this->theta);
    }

    public function y() {
        return $this->rho * sin($this->theta);
    }
}

final class DistanceCalculator {
    function distanceBetween(Point $origin, Point $destination) {

        return sqrt((($destination->x() - $origin->x() ^ 2) + (($destination->y() - $origin->y()) ^ 2)));
    }

}

```

## Detection

You can set your linters to warn you for public attributes, setters and getters usage and discourage them.

## Tags

- Coupling

## Conclusion

If your classes are polluted with setters, getters and public methods you will certainly have ways to couple to their accidental implementation.

## Also Known As

>Also Known as

- Inappropriate intimacy

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/code-smell-28-setters](https://maximilianocontieri.com/code-smell-28-setters)