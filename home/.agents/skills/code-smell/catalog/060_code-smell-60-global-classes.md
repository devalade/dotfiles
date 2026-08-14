# Code Smell 60 - Global Classes

Classes are handy. We can call them and invoke them at any time. Is this good?

**TL;DR:** Don't use your classes as a global point of access.

## Problems

- Coupling

- Classes are global unless we use Namespaces.

- Name polluting

- Static Methods

- Static Constants

- Singletons

## Solutions

- Use namespaces, module qualifiers or similar

- Avoid namespace polluting, keep the Global names as short as possible.

- Class single Responsibility is to create instances.

## Sample Code

##### Wrong

```
<?

final class StringUtilHelper {
    static function reformatYYYYDDMMtoYYYYMMDD($date) {
    }
}

class Singleton {

}

final class DatabaseAccessor extends Singleton {

}

```

##### Right

```
<?

namespace Date;

final class DateFormatter {

    function reformatYYYYDDMMtoYYYYMMDD(Date $date) {
    }
    //function is not static since class single responsibility is to create instances and not be a library of utils

}

namespace OracleDatabase;

class DatabaseAccessor {
    //Database is not a singleton and it is namespace scoped
}

```

## Detection

We can use almost any linter or create dependency rules searching for bad class references.

## Tags

- Globals

## Conclusion

We should restrict our classes to small domains and expose just facades to the outside. This greatly reduces coupling.

## Relations

[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)

[https://maximilianocontieri.com/code-smell-17-global-functions](https://maximilianocontieri.com/code-smell-17-global-functions)