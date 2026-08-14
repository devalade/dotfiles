# Code Smell 193 - Switch Instead of Formula

(O) log(n)

**TL;DR:** Be declarative enough but no more.

## Problems

- Readability

- Premature Optimization

## Solutions

- Use a short version (or not).

- Always favor readability >> Premature optimization.

- Humans learn by examples, not by formulas.

- Shorter is not always better.

## Sample Code

##### Wrong?

```
private static string GetPercentageRounds(double percentage)
        {
            if (percentage == 0)
                return "⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪";
            if (percentage > 0.0 && percentage <= 0.1)
                return "🔵⚪⚪⚪⚪⚪⚪⚪⚪⚪";
            if (percentage > 0.1 && percentage <= 0.2)
                return "🔵🔵⚪⚪⚪⚪⚪⚪⚪⚪";
            if (percentage > 0.2 && percentage <= 0.3)
                return "🔵🔵🔵⚪⚪⚪⚪⚪⚪⚪";
            if (percentage > 0.3 && percentage <= 0.4)
                return "🔵🔵🔵🔵⚪⚪⚪⚪⚪⚪";
            if (percentage > 0.4 && percentage <= 0.5)
                return "🔵🔵🔵🔵🔵⚪⚪⚪⚪⚪";
            if (percentage > 0.5 && percentage <= 0.6)
                return "🔵🔵🔵🔵🔵🔵⚪⚪⚪⚪";
            if (percentage > 0.6 && percentage <= 0.7)
                return "🔵🔵🔵🔵🔵🔵🔵⚪⚪⚪";
            if (percentage > 0.7 && percentage <= 0.8)
                return "🔵🔵🔵🔵🔵🔵🔵🔵⚪⚪";
            if (percentage > 0.8 && percentage <= 0.9)
                return "🔵🔵🔵🔵🔵🔵🔵🔵🔵⚪";

            return "🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵";
        }
    }
}

// Full source
// https://github.com/MinBZK/woo-besluit-broncode-digid-app/blob/master/Source/DigiD.iOS/Services/NFCService.cs

```

##### Right?

```
private static string GetPercentageRounds(double percentage)
{
    string dots = "🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵⚪⚪⚪⚪⚪⚪⚪⚪⚪⚪";
    int blueDots = (int) Math.Truncate (percentage* 10);
    int startingPoint = 10-blueDots;
    return dots. Substring(startingPoint, 10);
}

```

## Detection

[X] Semi-Automatic

This is a semantic smell. In this case, we can count the number of if clauses.

## Tags

- Readability

## Conclusion

You can read the original Twitter thread to take your own conclusions. There's some serious debate and, of course, several premature optimizators bringing obscure and unneeded solutions with (O) log(n) complexity and stupid benchmarks evidence for a loop that executes only once.

And lots of memes.

As a final conclusion, I asked ChatGPT and was not able to simplify it.

## Relations

[https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements](https://maximilianocontieri.com/code-smell-36-switchcaseelseifelseif-statements)
[https://maximilianocontieri.com/code-smell-20-premature-optimization](https://maximilianocontieri.com/code-smell-20-premature-optimization)