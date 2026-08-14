# Code Smell 273 - Overengineering

Remember: AI Assistants make lots of mistakes

**TL;DR:** Overengineering complicates your code.

## Problems

- Unnecessary accidental complexity
- Premature optimizations
- Unnecessary abstractions
- Poor Maintainability
- Overly detailed designs
- Slow iteration cycles
- Bijection violation
- Performance penalties

## Solutions

- Keep it Simple, Stupid
- Simplify code paths
- Minimize abstractions
- Use the MAPPER as guidance to find abstractions
- Focus on the core logic
- Follow Occam's razor by cutting away non-essential elements
- Refactor regularly

## Sample Code

##### Wrong

```
// Overengineered approach
// with unnecessary factory and abstract layers
public abstract class PlanetCalculator {
    public abstract double calculateDarkMatter(double mass);
}

public class TransneptunianCalculator extends PlanetCalculator {
    @Override
    public double calculateDarkMatter(double mass) {
        // Complex, unnecessary steps for a simple calculation
        double gravitationalConstant = 6.67430e-11;
        double darkMatter = mass * gravitationalConstant * 0.25;
        // Hypothetical calculation
        return darkMatter;
    }
}

public class PlanetCalculatorFactory {
    public static PlanetCalculator getCalculator(String type) {
        if ("Transneptunian".equals(type)) {
            return new TransneptunianCalculator();
        }
        throw new IllegalArgumentException("Unknown calculator type");
    }
}

// Usage
PlanetCalculator calculator =
    PlanetCalculatorFactory.getCalculator("Transneptunian");
double darkMatter = calculator.calculateDarkMatter(1000);

```

##### Right

```
// Simpler approach, without unnecessary factories and abstractions
public class DarkMatterCalculator {
    public double calculateDarkMatter(double mass) {
        return mass * 6.67430e-11 * 0.25; // Hypothetical calculation
    }
}

// Usage
DarkMatterCalculator calculator = new DarkMatterCalculator();
double darkMatter = calculator.calculateDarkMatter(1000);

```

## Detection

[X] Manual

This is a semantic smell.

You can detect overengineering by looking for excessive classes, methods, or features that do not contribute directly to solving the problem.

 If you find yourself adding functionality that seems duplicated, unnecessary, or too complex, you likely have a case of over-engineering.

## Tags

- Complexity

## Conclusion

Overengineering complicates your codebase and leads to maintenance headaches. Keep your designs simple, focus on solving your specific problem, and avoid unnecessary patterns and abstractions.

## Relations

[https://maximilianocontieri.com/code-smell-182-over-generalization](https://maximilianocontieri.com/code-smell-182-over-generalization)
[https://maximilianocontieri.com/code-smell-264-hanlons-razor](https://maximilianocontieri.com/code-smell-264-hanlons-razor)