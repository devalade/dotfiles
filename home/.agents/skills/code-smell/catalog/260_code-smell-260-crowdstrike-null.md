# Code Smell 260 - Crowdstrike NULL

std::optional

**TL;DR:** Using null pointers in critical code can crash your system

## Problems

- Memory access violation

- Unpredictable behavior

- Null Pointer Dereference

- Unexpected program termination

- System instability

- No healing/recovery strategy

- Security Risk

## Solutions

- Avoid using NULLs

- Use address sanitizers

- Make controlled releases to mission-critical software

- Create better rollback strategies instead of BSOD

- Use Smart Pointers: Manage memory automatically and avoid null pointers with smart pointers

- Create self-healing software.

- Apply defensive programming

- Improve your QA tests before deploying to production.

## Sample Code

##### Wrong

```
// This case is not exactly what happened with Crowdstrike
// It is here for illustration purposes
void* get_data() {
  if (data_available) {
    return data_ptr;  // This could be null!
  } else {
    // Uh oh, what if data_ptr is null here?
    return NULL;
    // Using Null to indicate no data
    // knowing Null is schizophrenic
  }
}

int process_data(void* data) {
  if (data != NULL) {
    // Maybe a null check, but not guaranteed!
    // Accessing data... (crash if data is Null)
    return *data;
  }
  // No check? Silent failure or unexpected behavior.
  return -1;
}

```

##### Right

```
std::unique_ptr<int> get_data() {
  if (data_available) {
    return std::make_unique<int>(data_value);
  } else {
    return nullptr;  // Explicitly return nullptr
  }
}

int process_data(const std::unique_ptr<int>& data) {
  if (data) { // Check for valid pointer
    return *data;
  } else {
    // Handle no data case (e.g., return default value)
    return 0;
  }
}

```

## Detection

[X] Semi-Automatic

You can detect this smell by checking for null pointer usage in critical parts of your code. Look for functions that process pointers and see if they handle null pointers safely.

Human code reviews are good for checking this kind of problem.

## Tags

- Null

## Conclusion

Voyager 1's software has been running for more than 50 years.

It was designed to be robust, reliable, and redundant which is sadly uncommon in some immature systems in 2024.

Avoid using null pointers in privileged mode drivers.

I have written a book on clean code and a whole chapter (#15) on how to avoid NULL and all the consequences it carries.

Hopefully, Crowdstrike engineers will read it!

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)

[https://maximilianocontieri.com/code-smell-126-fake-null-object](https://maximilianocontieri.com/code-smell-126-fake-null-object)

[https://maximilianocontieri.com/code-smell-208-null-island](https://maximilianocontieri.com/code-smell-208-null-island)