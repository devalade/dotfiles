# Code Smell 126 - Fake Null Object

Null Objects are great alternatives to The Billion Dollar Mistake. Sometimes we don't need them

**TL;DR:** Don't abuse patterns. Even NullObject.

## Problems

- Empty Classes

- Namespace Polluting

- Duplicated Behavior

## Solutions

- Create Null Objects instantiating real-object classes.

## Sample Code

##### Wrong

```
abstract class Address {
    public abstract String getCity();
    public abstract String getState();
    public abstract String getZipCode();
}

//Using inheritance for null objects is a mistake
//We should use interfaces (when available)
public class NullAddress extends Address {

    public NullAddress() { }

    public String getCity() {
        return Constants.EMPTY_STRING;
    }

    public String getState() {
        return Constants.EMPTY_STRING;
    }

    public String getZipCode() {
        return Constants.EMPTY_STRING;
    }

}

public class RealAddress extends Address {

    private String zipCode;
    private String city;
    private String state;

    public RealAddress(String city, String state, String zipCode) {
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

}

```

##### Right

```
//There are just "addresses"
public class Address {

    private String zipCode;
    private String city;
    private String state;

    public Address(String city, String state, String zipCode) {
    //Looks anemic :(
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }

    public String zipCode() {
        return zipCode;
    }

    public String city() {
        return city;
    }

    public String state() {
        return state;
    }

}

Address nullAddress = new Address(Constants.EMPTY_STRING, Constants.EMPTY_STRING, Constants.EMPTY_STRING);
//we have our null object
//we should NOT assign it to a singleton, static or global
//It behaves like a null object. That's enough
//No premature optimizations

```

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Null

## Conclusion

Creating Null Object classes is sometimes overdesign.

We need to create a real object.

This real object should never be global, singleton, or static.

Too many smells to avoid.

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)
[https://maximilianocontieri.com/code-smell-32-singletons](https://maximilianocontieri.com/code-smell-32-singletons)
[https://maximilianocontieri.com/code-smell-114-empty-class](https://maximilianocontieri.com/code-smell-114-empty-class)
[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)

[https://maximilianocontieri.com/code-smell-17-global-functions](https://maximilianocontieri.com/code-smell-17-global-functions)