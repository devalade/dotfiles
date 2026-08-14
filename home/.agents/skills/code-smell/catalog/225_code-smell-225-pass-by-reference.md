# Code Smell 225 - Pass by Reference

pass-by-value

**TL;DR:** Beware of passing arguments by reference

## Problems

- Unexpected Results

- Side Effects

- Readability

- Broken Encapsulation

## Solutions

- Pass arguments by copying even large objects. Don't make premature optimizations.

- Declare variables as constants

- Refactor the code

- Make objects immutable to avoid accidental changes

5 Use Pure Functions

## Sample Code

##### Wrong

```
using System;

namespace Example
{
     class Betelgeuse
     {
         static void Main(string[] args)
         {
             double starSize = 100.0;
             Console.WriteLine("star size: {0}", starSize);
             // star size: 100
             double supernovaSize = SimulateFinalSize(ref starSize);
             // Notice 'ref' modifier
             Console.WriteLine("supernova size: {0}", supernovaSize);
             // supernova size: 10000
             Console.WriteLine("original star size after: {0}", starSize);
             // original star size after: 10000
             // WRONG: It should not be affected
         }
         public static double SimulateFinalSize(ref double size)
         {
             // Notice 'ref' modifier
             // Oversimplification
             // You should use Sedov-Taylor solution
              size = size * 100;
              return size;
         }
     }
}

```

##### Right

```
using System;

namespace Example
{
     class Betelgeuse
     {
         static void Main(string[] args)
         {
             const double starSize = 100.0;
             // The const modifier warns the compiler
             Console.WriteLine("star size: {0}", starSize);
             // star size: 100
             double supernovaSize = SimulateFinalSize(starSize);
             // Notice 'ref' is omitted
             Console.WriteLine("supernova size: {0}", supernovaSize);
             // supernova size: 10000
             Console.WriteLine("original star size after: {0}", starSize);
             // original star size after: 100
             // It remains at the original value
         }
         public static double SimulateFinalSize(double size)
         {
             // Notice 'ref' is omitted
             // Oversimplification
             // You should use Sedov-Taylor solution
              size = size * 100;
              return size;
         }
     }
}

```

## Detection

[X] Semi-Automatic

You can use many linters to warn with arguments passed by reference

## Tags

- Readability

## Conclusion

Passing objects by reference can lead to unexpected side effects if the function modifies the object in a way that wasn't anticipated by the caller.

You should use copy by value instead.

## Relations

[https://maximilianocontieri.com/code-smell-116-variables-declared-with-var](https://maximilianocontieri.com/code-smell-116-variables-declared-with-var)
[https://maximilianocontieri.com/code-smell-176-changes-in-essence](https://maximilianocontieri.com/code-smell-176-changes-in-essence)
[https://maximilianocontieri.com/code-smell-209-side-effects](https://maximilianocontieri.com/code-smell-209-side-effects)