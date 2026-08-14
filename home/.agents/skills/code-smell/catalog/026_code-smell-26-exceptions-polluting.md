# Code Smell 26 - Exceptions Polluting

It is very nice to have lots of different exceptions. Your code is declarative and robust. Or not?

**TL;DR:** Don't create anemic and empty objects. Even if they are Exceptions.

## Problems

- Over Design

- Namespace Pollution

## Solutions

- Avoid creating anemic exceptions as globals.

- Create exceptions only if they behave differently.

- Model exceptions with objects. Classes are handy for lazy programmers.

- Remove Unhandled Exceptions.

## Sample Code

##### Wrong

```
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class FileReader {

    public static void main(String[] args) {
        FileReader file = null;

        try {
            file = new FileReader("source.txt");
            file.read();
        }
        catch(FileNotFoundException e) {
            e.printStackTrace();
        }
        catch(FileLockedException e) {
            e.printStackTrace();
        }
        catch(FilePermissionsException e) {
            e.printStackTrace();
        }
        catch(IOException e) {
            e.printStackTrace();
        }
        finally {
            try {
                file.close();
            }
            catch(IOException e) {
                e.printStackTrace();
            }
        }
    }
}

```

##### Right

```
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class FileReader {

    public static void main(String[] args) {
        FileReader file = null;

        try {
            file = new FileReader("source.txt");
            file.read();
        }
        catch(FileException exception) {
            if (exception.description == (this.expectionMessages().errorDescriptionFileTemporaryLocked() {
                //sleep and retry
                //IF behaviour is the same with all the exceptions just change the text on object creation and raise the correct instance
            }
            this.showErrorToUser(exception.messageToUser();
             //This example is simplified. Text should be translated
        }
        finally {
            try {
                file.close();
            }
        }
    }
}

```

## Detection

New exceptions should override behavior methods.

No. code, description, resumable, etc. are not behavioral.

## Tags

- Abuser

- Naming

## Conclusion

You would not create different classes for every Person instance, so they return different names. Why would you do it with exceptions?

How often do you catch a specific exception?

Go out and check your code.

Is it necessary to be a class?

You are already coupled to the class. Couple to the description instead.

Exception instances should NOT be Singletons.

## Relations

[https://maximilianocontieri.com/code-smell-01-anemic-models](https://maximilianocontieri.com/code-smell-01-anemic-models)