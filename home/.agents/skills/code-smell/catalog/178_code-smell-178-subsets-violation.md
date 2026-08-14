# Code Smell 178 - Subsets Violation

EmailAddresses

**TL;DR:** Create Small objects and restrict your domain.

## Problems

- Bijection Fault

- Fail fast principle violation

- Repeated Code validation

## Solutions

- Create small objects and validate the domain.

## Sample Code

##### Wrong

```
destination = "destination@example.com"

destination = "destination.example.com"
// No error thrown

```

##### Right

```
public class EmailAddress {
    public String emailAddress;

    public EmailAddress(String address) {
        string expressions = @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
        if (!Regex.IsMatch(email, expressions) {
          throw new Exception('Invalid address');
        }
        this.emailAddress = address;
    }
}

destination = new EmailAddress("destination@example.com");

```

Not to be confused with the anemic Java version

## Detection

[X] Manual

This is a semantic smell.

## Tags

- Primitive Obsession

## Conclusion

We need to be loyal to the bijection of the real world.

Subsets are very important for early validations and fail fast principle.

## Relations

[https://maximilianocontieri.com/code-smell-122-primitive-obsession](https://maximilianocontieri.com/code-smell-122-primitive-obsession)