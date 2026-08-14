# Code Smell 202 - God Constant Class

**TL;DR:** Don't define too many unrelated constants in the same class. Don't pile up the junk together.

## Problems

- Bad Cohesion

- High Coupling

- Magic Numbers

- Single Responsibility principle violation

## Solutions

- Break the contents following Real World responsibilities using the MAPPER.

## Sample Code

##### Wrong

```

public static class GlobalConstants
{
    public const int MaxPlayers = 10;
    public const string DefaultLanguage = "en-US";
    public const double Pi = 3.14159;
}

```

##### Right

```

public static class MaxPlayersConstants
{
    public const int MaxPlayers = 10;
}

public static class DefaultLanguageConstants
{
    public const string DefaultLanguage = "en-US";
}

public static class MathConstants
{
    public const double Pi = 3.14159;
}

```

## Detection

[X] Semi-Automatic

We can tell our linters to warn us of too many constants' definitions against a preset threshold.

## Tags

- Coupling

## Conclusion

Finding correct responsibilities is one of our primary tasks when designing software.

## Relations

[https://maximilianocontieri.com/code-smell-14-god-objects](https://maximilianocontieri.com/code-smell-14-god-objects)
[https://maximilianocontieri.com/code-smell-29-settingsconfigs](https://maximilianocontieri.com/code-smell-29-settingsconfigs)
[https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers](https://maximilianocontieri.com/code-smell-02-constants-and-magic-numbers)