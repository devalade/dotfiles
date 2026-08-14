# Code Smell 236 - Unwrapped Lines

Formatting plays a crucial role in creating code that is not only functional but also readable and maintainable. In this article, I will shed light on the code smell associated with neglecting proper line wrapping and explore why it's considered bad practice, too long, isn't it?

**TL;DR:** Extract and wrap your code

## Problems

- Hard to read code (especially in small devices)

- Demeter's Law violation

## Solutions

- Wrap the code to at most 75 characters

- Break and concatenate long strings. Compilers optimize them. Thinking there's a speed penalty is a premature optimization mistake.

- Don't use Abbreviations

## Sample Code

##### Wrong

```
struct ExtraterrestrialSignal { signal_frequency: f64, signal_strength: f64, signal_duration: f64, }

fn perform_signal_processing_and_analysis(extraterrestrial_signal: &ExtraterrestrialSignal,
) {
    println!(
        "Extraterrestrial Signal processed - Frequency: {} Hz, Strength: {}, Duration: {} seconds", extraterrestrial_signal.signal_frequency,  extraterrestrial_signal.signal_strength, extraterrestrial_signal.signal_duration);

    if extraterrestrial_signal.signal_strength > 0.8 && extraterrestrial_signal.signal_duration > 10.0
    {
        println!("Potential Extraterrestrial Signal of interest!");
    } else {
        println!("Signal does not meet criteria for further investigation.");
    }
}

```

##### Right

```
struct ExtraterrestrialSignal {
    signal_frequency: f64,
    signal_strength: f64,
    signal_duration: f64,
}

fn perform_signal_processing_and_analysis(
    extraterrestrial_signal: &ExtraterrestrialSignal,
) {
    println!(
        "Extraterrestrial Signal processed" +
          "- Frequency: {} Hz, Strength: {}, Duration: {} seconds",
        extraterrestrial_signal.signal_frequency,
        extraterrestrial_signal.signal_strength,
        extraterrestrial_signal.signal_duration
    );

    if extraterrestrial_signal.signal_strength > 0.8
        && extraterrestrial_signal.signal_duration > 10.0
    {
        println!("Potential Extraterrestrial Signal of interest!");
    } else {
        println!("Signal does not meet criteria for further investigation.");
    }
}

```

## Detection

[X] Automatic

This is a formatting and syntactic smell

## Tags

- Formatting

## Conclusion

Ensuring readability is consistently paramount, with various facets warranting consideration.

When lines of code are excessively long, developers may find it challenging to understand the structure and flow of the code.

## Relations

[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)
[https://maximilianocontieri.com/code-smell-48-code-without-standards](https://maximilianocontieri.com/code-smell-48-code-without-standards)
[https://maximilianocontieri.com/code-smell-164-mixed-indentations](https://maximilianocontieri.com/code-smell-164-mixed-indentations)
[https://maximilianocontieri.com/code-smell-211-tab-over-spaces](https://maximilianocontieri.com/code-smell-211-tab-over-spaces)