# Code Smell 234 - Long Circuit

**TL;DR:** Premature Optimization is Evil. Optimization is Good.

## Problems

- Low Performance

## Solutions

- Sort the conditions from faster to slower

## Sample Code

##### Wrong

```
def is_warm():
    # This is a fast api call to your thermometer
    response = requests.get("https://iot-device-api.example.com/current_temperature")
    temperature_data = response.json()

    return temperature_data.get('temperature', 0) > 25

def is_weekend():
    # This function checks if today is a weekend based on a slow calendar API call
    response = requests.get("https://calendar-api.example.com/today")
    calendar_data = response.json()

    return calendar_data.get('day_of_week', '').lower() in ['saturday', 'sunday']

def is_sunny():
    # Very slow function to a low performant weather API call
    response = requests.get("https://weather-api.example.com/current")
    weather_data = response.json()

    return weather_data.get('weather', '') == 'sunny'

is_sunny_value = is_sunny()
is_warm_value = is_warm()
is_weekend_value = is_weekend()

if is_sunny_value and is_warm_value and is_weekend_value:
    # the 3 conditions are always evaluated
    print("Let's go outside!")
else:
    print("Stay at home.")

```

##### Right

```
if is_warm() and is_weekend() and is_sunny():
    # the 3 conditions are evaluated in short circuit
    # and sorted from fastest to slowest
    # for a fast exit
    print("Let's go outside!")
else:
    print("Stay at home.")

```

## Detection

[X] Semi-Automatic

You can detect slow calls using actual benchmarks.

Do not consider algorithm complexity since sometimes it is unrelated to actual data distribution. (for example, optimizing an array with a few elements).

## Tags

- Performance

## Conclusion

Find bottlenecks using Pareto rules.

Optimize your code-critical sections.

## Relations

[https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation](https://maximilianocontieri.com/code-smell-140-short-circuit-evaluation)
[https://maximilianocontieri.com/code-smell-145-short-circuit-hack](https://maximilianocontieri.com/code-smell-145-short-circuit-hack)