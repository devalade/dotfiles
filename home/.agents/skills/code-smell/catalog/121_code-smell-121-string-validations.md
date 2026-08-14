# Code Smell 121 - String Validations

You need to validate strings. So you don't need strings at all

**TL;DR:** Search for missing domain objects when validating strings.

## Problems

- Primitive obsession.

- Bijection Fault

- Validated strings are a subset of all possible strings.

- Fail Fast principle violation.

- Single Responsibility Principle violation.

- DRY Principle Violation.

## Solutions

- Create a first-class object representing the concept under the MAPPER

## Sample Code

##### Wrong

```
<?

//First Example: Address Validation
class Address {
  function __construct(string $emailAddress) {
     //String validation on Address class violates SRP
     $this->validateEmail($emailAddress);
     //...
   }

  private function validateEmail(string $emailAddress) {
    $regex = "/[a-zA-Z0-9_-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/";
    //Regex is a sample / It might be wrong
    //Emails and Urls should be first class objects

    if (!preg_match($regex, $emailAddress))
    {
      throw new Exception('Invalid email address ' . emailAddress);
    }
  }
}

//Second Example: Wordle

class Wordle {
  function validateWord(string $wordleword){
    //Wordle word should be a real world entity. Not a subset of strings
  }
 }

```

##### Right

```
<?

//First Example: Address Validation
class Address {
  function __construct(EmailAddress $emailAddress) {
     //Email is always valid / Code is cleaner
     //...
   }
}

class EmailAddress {
  //We can reuse this object many times avoiding copypasting
  string $address;
  private function __construct(string $emailAddress) {
    $regex = "/[a-zA-Z0-9_-.+]+@[a-zA-Z0-9-]+.[a-zA-Z]+/";
    //Regex is a sample / It might be wrong
    //Emails and Urls are first class objects

    if (!preg_match($regex, $emailAddress))
    {
      throw new Exception('Invalid email address ' . emailAddress);
    }
    $this->address = $emailAddress;
  }
}

//Second Example: Wordle

class Wordle {
  function validateWord(WordleWord $wordleword){
    //Wordle word is a real world entity. Not a subset of string
  }
 }

class WordleWord {
  function __construct(string $emailAddress)
    //Avoid building invalid world words
    //For example length != 5
  }
 }

```

## Detection

[X] Semi-Automatic

We can check all constructors validating strings and reify the missing concepts.

## Tags

- Primitive Obsession

## Conclusion

Small objects are hard to find.

Primitive obsessors always complain about this kind of indirections.

Creating these new small concepts keeps our model loyal to the bijection and ensures our models are always healthy.

## Relations

[https://maximilianocontieri.com/code-smell-41-regular-expression-abusers](https://maximilianocontieri.com/code-smell-41-regular-expression-abusers)
[https://maximilianocontieri.com/code-smell-04-string-abusers](https://maximilianocontieri.com/code-smell-04-string-abusers)