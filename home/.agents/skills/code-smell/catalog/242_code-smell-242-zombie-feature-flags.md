# Code Smell 242 - Zombie Feature Flags

Feature flags are evil... and sometimes come back as zombies

**TL;DR:** Don't leave dead [unused code](https://maximilianocontieri.com/code-smell-09-dead-code). Clean your flag mess.

## Problems

- Dead Code

- Maintainability

- Unnecessary complexity

## Solutions

- Clean up dead code

- Set up a clear lifecycle for your Feature Flags

## Sample Code

##### Wrong

```
public class WeatherSimulation {
    private boolean isWeatherSimulationEnabled ;
    // This feature flag controls weather simulation

    public WeatherSimulation() {
        Properties config = new Properties();
        FileInputStream fis = new FileInputStream("config.properties")) {
            config.load(fis);
            isWeatherSimulationEnabled = Boolean.parseBoolean(
                config.getProperty("weatherSimulation.enabled", "false"));
            // The feature toggle is read from the file
            isWeatherSimulationEnabled = false;
        }
    }

    public void simulateWeather() {
        if (isWeatherSimulationEnabled) {
            // Code to simulate weather conditions
            // ...
            System.out.println("Simulating weather...");
        }
    }
}

```

##### Right

```
public class WeatherSimulation {

    public WeatherSimulation() {
        Properties config = new Properties();
        FileInputStream fis = new FileInputStream("config.properties")) {
            config.load(fis);
            String weatherSimulationEnabledValue =
              config.getProperty("weatherSimulation.enabled");
            if (weatherSimulationEnabledValue != null) {
                throw new IllegalStateException(
                  "weatherSimulation.enabled property " +
                  "should not be present in the configuration file.");
                // You follow the fail-fast principle.
                // Feature is deprecated
                // and users got a grace period notice
                // After that you should stop the execution
            }
        }
    }

    public void simulateWeather() {
       // You remove the simulated code and simplify it
    }
}

```

## Detection

[X] Semi-Automatic

You can use mutation testing and remove the potential dead code to see if your coverage net catches a defect.

## Tags

- Bloaters

## Conclusion

You should regularly review and clean up feature flags and their associated code to remove any unnecessary or obsolete sections.

This ensures that the code remains lean, understandable, and free from potential issues caused by dead code.

Feature flags should be shortlived and the lifecycle must be supervised.

## Relations

[https://maximilianocontieri.com/code-smell-09-dead-code](https://maximilianocontieri.com/code-smell-09-dead-code)
[https://maximilianocontieri.com/code-smell-29-settingsconfigs](https://maximilianocontieri.com/code-smell-29-settingsconfigs)