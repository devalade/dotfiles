# Code Smell 16 - Ripple Effect

Small changes yield unexpected problems.

**TL;DR:** If small changes have big impact, you need to decouple your system.

## Problems

- Coupling

https://maximilianocontieri.com/coupling-the-one-and-only-software-design-problem

## Solutions

- Decouple.
- Cover with tests.
- Refactor and isolate what is changing.
- Depend on interfaces.

https://maximilianocontieri.com/how-to-decouple-a-legacy-system

## Sample Code

##### Wrong

```
class Time {
   constructor(hour, minute, seconds) {
     this.hour = hour;
     this.minute = minute;
     this.seconds = seconds;
  }
    now(){
      //call operating system
    }
}

//Adding a TimeZone will have a big Ripple Effect
//Changing now() to consider timezine will also bring the effect

```

##### Right

```
class Time {
   constructor(hour, minute, seconds, timezone) {
     this.hour = hour;
     this.minute = minute;
     this.seconds = seconds;
     this.timezone = timezone;
  }
  //Removed now() since is invalid without context
}

class RelativeClock {
   constructor(timezone){
     this.timezone = timezone;
   }
   now(timezone){
     var localSystemTime = this.localSystemTime();
     var localSystemTimezone = this.localSystemTimezone();
     //Do some math translating timezones
     //
     return new Time(..., timezone);
   }
}

```

## Detection

- It is not easy to detect problems before they happen. Mutation Testing and root cause analysis of single points of failures may help.

## Tags

- Legacy

## Conclusion

There are multiple strategies to deal with Legacy and coupled systems. We should deal with this problem before it explodes under our eyes.

## Relations

- [Code Smell 08 - Long Chains Of Collaborations](https://maximilianocontieri.com/code-smell-08-long-chains-of-collaborations)