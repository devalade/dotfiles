# Code Smell 249 - Constants as Numbers

integers

**TL;DR:** Use real-world constants as constants

## Problems

- Bijection Violation

- Debugging

- Premature Optimization

- Maintainability

- Type Safety

- Limited Extensibility

## Solutions

- Use descriptive string constants

- Use Enums

- Create A Polymorphic) Hierarchy

## Sample Code

##### Wrong

```
public const FORMAT_JPG = 1;
public const FORMAT_GIF = 2;
public const FORMAT_PNG = 3;

```

##### Right

```
public const string FORMAT_JPG = "JPG";
public const string FORMAT_GIF = "GIF";
public const string FORMAT_PNG = "PNG";

// OR

public enum ImageFormat
{
    JPG,
    GIF,
    PNG
}

```

## Detection

[X] Semi-Automatic

You can tell your linters to warn you about this usage, but they can show you some false positives.

## Tags

- Readability

## Conclusion

After this correction, your code will be cleaner readable, and self-explanatory for debugging.

You can read it and It's clear what each constant represents.

If you need to add more formats or change the order, you should update the enumeration definition without affecting the rest of the code.

IDEs with auto-completion and error checking will give you better support to work with enums.

## Relations

[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)
[https://maximilianocontieri.com/code-smell-110-switches-with-defaults](https://maximilianocontieri.com/code-smell-110-switches-with-defaults)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)