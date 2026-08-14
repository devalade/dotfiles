# Code Smell 04 - String Abusers

Too many parsing, exploding, regex, strcomp, strpos and string manipulation functions.

**TL;DR:** Use real abstractions and real objects instead of string accidental manipulation.

## Problems

- Complexity
- Readability
- Maintainability
- Lack of Abstractions

## Solutions

1) Work with objects instead.

2) Replace strings with data structures dealing with object relations.

3) Go back to Perl :)

4) Find Bijection problems between real objects and the strings.

## Sample Code

##### Wrong

```
<?

$schoolDescription = 'College of Springfield';

preg_match('/[^ ]*$/', $schoolDescription, $results);
$location = $results[0]; // $location = 'Springfield'.

$school = preg_split('/[\s,]+/', $schoolDescription, 3)[0]; //'College'

```

##### Right

```
<?

class School {

    private $name;
    private $location;

    function description() {
        return $this->name . ' of ' . $this->location->name;
    }

}

```

## Detection

Automated detection is not easy. If code uses too many string functions it can trigger a warning.

## Tags

- Mapping

## Conclusion

Don't abuse strings. Favor real objects. Find absent protocol to distinguish them from strings.

## Relations

- Primitive Obsession