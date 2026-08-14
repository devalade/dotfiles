# Code Smell 39 - new Date()

70s first tutorial: getCurrentDate(). Piece of Cake. We are in the 20s Time is global no more

## Problems

- Coupling

- Fragile Tests

- Timezone Problems

## Solutions

- Use Dependency injection to decouple time source.

## Sample Code

##### Wrong

```
var today = new Date();

```

##### Right

```
var ouagadougou = new Location();

var today = myTimeSource.currentDateIn(ouagadougou);

function testTimePasses() {

  $mockTime = new MockedDate(new Date(1,1,2021));
  myDomainSystem = new TimeSystem(new MockedTime());
  // ..

  $mockTime.moveDateTo(new Date(1,1,2022));

  // ...
  this.assert(10, myDomainSystem.accuredInterests());

}

```

## Detection

We should forbid global functions policies. We need to couple to accidental and pluggable time sources.

## Conclusion

Date.today() , Time.now(),  and other global system calls are coupling smell.

Since tests must be in full environmental control. We should easily set up time, moved it back and forth etc.

Date and Time classes should only create immutable instances. It is not their responsibility to give the actual time. This violates Single Responsibility Principle.

The passage of time is always scorned by programmers. This makes objects mutable and designs poor and coupled.

## Relations

[https://maximilianocontieri.com/code-smell-18-static-functions](https://maximilianocontieri.com/code-smell-18-static-functions)