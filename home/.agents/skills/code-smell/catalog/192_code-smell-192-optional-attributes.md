# Code Smell 192 - Optional Attributes

**TL;DR:** Collections are fantastic. And Polymorphic.

## Problems

- Null
- If Pollution

## Solutions

- Change the optional attribute to a collection.

## Sample Code

##### Wrong

```
class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  email() {
    return this.email;
    // might be null
  }

}

// We cannot use safely person.email()
// We need to check for null explicitly

```

##### Right

```
class Person {
  constructor(name, emails) {
    this.name = name;
    this.emails = emails;
  }

  emails() {
    return this.emails;
  }

  // We can mutate the emails since they are not essential

  addEmail(email) {
    this.emails.push(email);
  }

  removeEmail(email) {
    const index = this.emails.indexOf(email);
    if (index !== -1) {
      this.emails.splice(index, 1);
    }
  }
}

// we can iterate the person.emails()
// in a loop without checking for null

```

## Detection

[X] Semi-Automatic

You can detect nullable attributes and change them when necessary.

## Tags

- Null

## Conclusion

This is a generalization of the null object pattern.

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)
[https://maximilianocontieri.com/code-smell-149-optional-chaining](https://maximilianocontieri.com/code-smell-149-optional-chaining)
[https://maximilianocontieri.com/code-smell-19-optional-arguments](https://maximilianocontieri.com/code-smell-19-optional-arguments)