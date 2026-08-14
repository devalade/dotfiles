# Code Smell 208 - Null Island

**TL;DR:** Don't use null for real places

## Problems

- Coupling

- Unexpected Results

## Solutions

- Model the unknown location with polymorphism

## Sample Code

##### Wrong

```
class Person(val name: String, val latitude: Double, val longitude: Double)

fun main() {
    val people = listOf(
        Person("Alice", 40.7128, -74.0060), // New York City
        Person("Bob", 51.5074, -0.1278), // London
        Person("Charlie", 48.8566, 2.3522), // Paris
        Person("Tony Hoare", 0.0, 0.0) // Null Island
    )

    for (person in people) {
        if (person.latitude == 0.0 && person.longitude == 0.0) {
            println("${person.name} lives on Null Island!")
        } else {
            println("${person.name} lives at (${person.latitude}, ${person.longitude}).")
        }
    }
}

```

##### Right

```
abstract class Location {
    abstract fun calculateDistance(other: Location): Double
}

class Coordinates(val latitude: Double, val longitude: Double) : Location() {
    override fun calculateDistance(other: Location): Double {
        val earthRadius = 6371.0 // kilometers
        val latDistance = Math.toRadians(latitude - other.latitude)
        val lngDistance = Math.toRadians(longitude - other.longitude)
        val a = sin(latDistance / 2) * sin(latDistance / 2) +
                cos(Math.toRadians(latitude)) * cos(Math.toRadians(other.latitude)) *
                sin(lngDistance / 2) * sin(lngDistance / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return earthRadius * c
    }
}

class UnknownLocation : Location() {
    override fun calculateDistance(other: Location): Double {
        throw IllegalArgumentException("Cannot calculate distance from unknown location.")
    }
}

class Person(val name: String, val location: Location)

fun main() {
    val people = listOf(
        Person("Alice", Coordinates(40.7128, -74.0060)), // New York City
        Person("Bob", Coordinates(51.5074, -0.1278)), // London
        Person("Charlie", Coordinates(48.8566, 2.3522)), // Paris
        Person("Tony Hoare", UnknownLocation()) // Unknown location
    )

    val rio = Coordinates(-22.9068, -43.1729) // Rio de Janeiro coordinates

    for (person in people) {
        try {
            val distance = person.location.calculateDistance(rio)
            println("${person.name} is ${distance} kilometers from Rio de Janeiro.")
        } catch (e: IllegalArgumentException) {
            println("${person.name} is at an unknown location.")
        }
    }
}

```

## Detection

[X] Semi-Automatic

We can check for special numbers used as nulls

## Tags

- Null

## Conclusion

Don't use Null to represent real objects

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)
[https://maximilianocontieri.com/code-smell-126-fake-null-object](https://maximilianocontieri.com/code-smell-126-fake-null-object)