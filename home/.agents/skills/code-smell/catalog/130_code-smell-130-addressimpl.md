# Code Smell 130 - AddressImpl

I

**TL;DR:** Name your classes after real-world concepts.

## Problems

- Bijection Fault

- Bad Names

## Solutions

- Find the correct name using the MAPPER

## Sample Code

##### Wrong

```
public interface Address extends ChangeAware, Serializable {

    /**
     * Gets the street name.
     *
     * @return the street name
     */
    String getStreet();
    //...
}

//Wrong Name - There is no concept 'AddressImpl' in real world
public class AddressImpl implements Address {
    private String street;
    private String houseNumber;
    private City city;
    //..
}

```

##### Right

```
//Simple
public class Address {
    private String street;
    private String houseNumber;
    private City city;
    //..
}

//OR
//Both are real-world names
public class Address implements ContactLocation {
    private String street;
    private String houseNumber;
    private City city;
    //..
}

```

## Detection

[X] Automatic

Since this is a naming smell.

We can search using regular expressions and rename these concepts.

## Tags

- Naming

## Conclusion

We should pick class names according to essential bijection and not follow accidental implementation.

Do not call I to your interfaces.

## Relations

[https://maximilianocontieri.com/code-smell-65-variables-named-after-types](https://maximilianocontieri.com/code-smell-65-variables-named-after-types)
[https://maximilianocontieri.com/code-smell-38-abstract-names](https://maximilianocontieri.com/code-smell-38-abstract-names)