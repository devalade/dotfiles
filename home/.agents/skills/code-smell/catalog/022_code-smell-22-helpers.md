# Code Smell 22 - Helpers

Do you need help? Who are you gonna call?

**TL;DR:** Helpers don't help. They are a non-cohesive bunch of messy subroutines.

## Problems

- Readability

- The Least surprise principle

- Bijection Fault

- Static methods

https://maximilianocontieri.com/what-exactly-is-a-name-part-ii-rehab

## Solutions

- Find a suitable name

- If the helper is a library, break all the services as different methods.

- Methods should always be fulfilled by objects. Static methods are another code smell.

- Avoid extracting the helpers to Anonymous Functions.

## Sample Code

##### Wrong

```
export default class UserHelpers {
  static getFullName(user) {
    return `${user.firstName} ${user.lastName}`;
  }

  static getCategory(userPoints) {
    return userPoints > 70 ? 'A' : 'B';
  }
}

```

Notice static methods.

```
import UserHelpers from './UserHelpers';

const alice = {
  firstName: 'Alice',
  lastName: 'Gray',
  points: 78,
};

const fullName = UserHelpers.getFullName(alice);
const category = UserHelpers.getCategory(alice);

```

##### Right

```
class UserScore {
  //This is anemic class and should have better protocol

  constructor(name, lastname, points) {
    this._name = name;
    this._lastname = lastname;
    this._points = points;
  }
  name(){
    return this._name;
  }
  lastname(){
    return this._lastname;
  }
  points(){
    return this._points;
  }
}

class FullNameFormatter {
  constructor(userscore) {
    this._userscore = userscore;

 }
  fullname() {
    return `${this._userscore.name()} ${this._userscore.lastname()}`;
  }
}

class CategoryCalculator{
  constructor(userscore1){
     this._userscore = userscore1;
 }
  display() {
    return this._userscore.points() > 70 ? 'A' : 'B';
  }
}

let alice = new UserScore('Alice', 'Gray', 78);

const fullName = new FullNameFormatter(alice).fullname();
const category = new CategoryCalculator(alice).display();

```

or we can make the former Helper stateless for reuse...

```
class UserScore {
  //This is anemic class and should have better protocol

  constructor(name, lastname, points) {
    this._name = name;
    this._lastname = lastname;
    this._points = points;
  }
  name(){
    return this._name;
  }
  lastname(){
    return this._lastname;
  }
  points(){
    return this._points;
  }
}

class FullNameFormatter {
  fullname(userscore) {
    return `${userscore.name()} ${userscore.lastname()}`;
  }
}

class CategoryCalculator{
  display(userscore) {
    return userscore.points() > 70 ? 'A' : 'B';
  }
}

let alice = new UserScore('Alice', 'Gray', 78);

const fullName = new FullNameFormatter().fullname(alice);
const category = new CategoryCalculator().display(alice);

```

## Detection

- Code naming standards should forbid classes with this name on them.

## Tags

- Namings

## Conclusion

This is a well established cultural name and a legacy habit from structured programming.

Most developers are reluctant to let old habits go.

We must be aware of the damage this kind of names are bringing us.

## Also Known As

>Also known as

- Utils

## Relations

[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)
[https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers](https://maximilianocontieri.com/code-smell-21-anonymous-functions-abusers)