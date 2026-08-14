# Code Smell 223 - Racial Naming

whitelists

**TL;DR:** Avoid old terms like whitelists, blacklists, master, etc.

## Problems

- Racial Connotations

- Exclusionary Language

- Diverse Perspectives

## Solutions

- Use alternative terminology

## Exceptions

- References to old manuals

## Sample Code

##### Wrong

```
val whitelist = listOf("Barbie", "Ken")

val blacklist = listOf("Midge")

val gitCommand = "git pull origin master"

val process = Runtime.getRuntime().exec(gitCommand)

```

##### Right

```
val allowlist = listOf("Barbie", "Ken")

val denylist = listOf("Midge")

val gitCommand = "git pull origin main"

val process = Runtime.getRuntime().exec(gitCommand)

```

## Detection

[X] Semi-Automatic

You can set up a denylist (not a blacklist) of terms you need to double-check for accuracy.

## Tags

- Naming

## Conclusion

Just as we refactor code to enhance its quality, we should also refactor our language and terminology to promote inclusivity and diversity.

By eliminating racially insensitive terms like "whitelist" and "blacklist" in favor of more inclusive alternatives, we contribute to a more equitable and welcoming tech industry.

Let's embrace change and create a coding environment where everyone feels valued, regardless of their background or ethnicity.

## Relations

[https://maximilianocontieri.com/code-smell-105-comedian-methods](https://maximilianocontieri.com/code-smell-105-comedian-methods)