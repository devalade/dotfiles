# Code Smell 205 - Code in Destructors

**TL;DR:** Don't use destructors. And don't write functional code there.

## Problems

- Coupling

- Unexpected results

- Memory leaks

## Solutions

- Don't use destructors.

- Follow the Rule of Zero

- Let the Garbage Collector work for you

## Exceptions

In very critical low-level code we cannot afford a Garbage Collector.

Exceptions are very few. In other cases writing code in destructors is a symptom of premature optimization.

## Sample Code

##### Wrong

```
class File {
public:
    File(const std::string& filename) {
        file_ = fopen(filename.c_str(), "r");
    }

    ~File() {
        if (file_) {
            fclose(file_);
        }
    }

private:
    FILE* file_;
};

```

##### Right

```
class File {
public:
    File() : file_(nullptr) {}

    bool Open(const std::string& filename) {
        if (file_) {
            fclose(file_);
        }
        file_ = fopen(filename.c_str(), "r");
        return (file_ != nullptr);
    }

    bool IsOpen() const {
        return (file_ != nullptr);
    }

    void Close() {
        if (file_) {
            fclose(file_);
            file_ = nullptr;
        }
    }

    ~File() {
        // Instead of closing the file we throw an exception
        // If it is open (which is an invalid scenario)
        if (file_) {
            throw std::logic_error("File is still open in destructor");
        }
    }

private:
    FILE* file_;
};

```

## Detection

[X] Automatic

Linters can warn us when we write code in destructors

## Tags

- Premature Optimization

## Conclusion

Writting code in destructors is a sign of sloppiness and laziness.

We need to understand the life cycle of our objects and manage the events accurately.

## Relations

[https://maximilianocontieri.com/code-smell-142-queries-in-constructors](https://maximilianocontieri.com/code-smell-142-queries-in-constructors)