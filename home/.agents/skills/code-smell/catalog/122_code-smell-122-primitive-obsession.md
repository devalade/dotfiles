# Code Smell 122 - Primitive Obsession

What

**TL;DR:** Use small objects instead of primitive ones.

## Problems

- Code Duplication

- Small Objects Missing

- Fail Fast principle violation.

- Bijection Fault

- Subset violations: Emails are a subset of strings, Valid Ages are a subset of Real, Ports are a subset of Integers, etc.

- We spread Logic and Behavior in many places.

- Premature Optimization.

## Solutions

- Create Small Objects

- Build missing abstractions using MAPPER

- Use Value-Objects.

## Sample Code

##### Wrong

```
//Samples borrowed with permission from
//https://towardsdev.com/why-a-host-is-not-a-string-and-a-port-is-not-an-integer-595c182d817c

var port = 8080;

var in = open("example.org", port);
var uri = urifromPort("example.org", port);
var address = addressFromPort("example.org", port);
var path = pathFromPort("example.org", port);

```

##### Right

```
//Samples borrowed with permission from
//https://towardsdev.com/why-a-host-is-not-a-string-and-a-port-is-not-an-integer-595c182d817c

const server = Port.parse(this, "www.kivakit.org:8080");
//Port is a smallobject with responsibilities and protocol

let in = port.open(this);
const uri = port.asUri(this);
const address = port.asInetSocketAddress();
const path = port.path(this, "/index.html");

```

## Detection

[X] Manual

We can automate checks on constructors for small objects missing opportunities.

## Tags

- Primitive Obsession

## Conclusion

We need to transform our strings, numbers, and arrays into small objects

## Relations

[https://maximilianocontieri.com/code-smell-121-string-validations](https://maximilianocontieri.com/code-smell-121-string-validations)
[https://maximilianocontieri.com/code-smell-04-string-abusers](https://maximilianocontieri.com/code-smell-04-string-abusers)