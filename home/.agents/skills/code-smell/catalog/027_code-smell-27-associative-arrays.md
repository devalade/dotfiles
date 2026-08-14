# Code Smell 27 - Associative Arrays

[Key, values], magic, fast, malleable and error prone.

**TL;DR:** Use arrays for rapid prototyping, use object for serious business.

## Problems

- Coupling

- Information Hiding

- Code Duplication

- Fail Fast

- Integrity

## Solutions

- Reify objects

- Create cohesive small objects

- Don't leave them anaemic, find their cohesive relations.

## Sample Code

##### Wrong

```
<?

$coordinate = array('latitude'=>1000, 'longitude'=>2000);
//Its OK. they are just arrays. a Bunch of raw data

```

###### Anaemic

```
<?

final class GeographicCoordinate {

    function __construct($latitude, $longitude) {
        $this->longitude = $longitude;
        $this->latitude = $latitude;
    }
}

$coordinate = new GeographicCoordinate(1000, 2000);
//should throw an error since these values don't exist on Earth

```

###### Validated

```
<?

final class GeographicCoordinate {

    function __construct($latitude, $longitude) {
        if (!$this->isValidLatitude($latitude)) {
            throw new InvalidLatitudeException($latitude);
            //...
            $this->longitude = $longitude;
            $this->latitude = $latitude;
        }
    }
}

$coordinate = new GeographicCoordinate(1000, 2000);
//trows an error since these values don't exist on Earth

```

##### Right

###### Degrees deserves reification

```
<?

final class Latitude {
    function __construct($degrees) {
        if (!$degrees->between(-90, 90)) {
            throw new InvalidLatitudeException($degrees);
        }
        //...
    }
}

```

Many people suffer from primitive obsession and believe this is over design.
Designing software is about making decisions and comparing trade-offs.
The performance argument is not valid nowadays since modern virtual machines can efficiently deal with small short-lived objects.

```
<?

final class GeographicCoordinate {

    function distanceTo(GeographicCoordinate $coordinate) {
    }

    function pointInPoligon(Polygon $polygon) {
        //....
    }
}

//Now we are in geometry world (and not in array world anymore). we can safely do many exciting things.

```

## Detection

We cannot forbid Associative Arrays since they are very good as a first approach.

They will be fine for exporting data, serialization, persistence and other accidental implementation issues.

We should avoid them on our systems.

## Tags

- Primitive

## Conclusion

When creating objects, we must not think of them as data. This is a common misconception.

We should stay loyal to our Bijection and discover real world objects.

Most associative arrays have cohesion and represent real-world entities, and we must treat them as first-class objects.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)
[https://maximilianocontieri.com/fail-fast](https://maximilianocontieri.com/fail-fast)
[https://maximilianocontieri.com/refactoring-012-reify-associative-arrays](https://maximilianocontieri.com/refactoring-012-reify-associative-arrays)