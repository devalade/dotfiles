# Code Smell 66 - Shotgun Surgery

## Problems

- Bad Responsibilities Assignments

- Code Duplication

- Maintainability

- Single Responsibility Violation.

- Copy-pasted code.

## Solutions

- Refactor

## Sample Code

##### Wrong

```
<?

final class SocialNetwork {

    function postStatus(string $newStatus) {
        if (!$user->isLogged()) {
            throw new Exception('User is not logged');
        }
        ///...
    }

    function uploadProfilePicture(Picture $newPicture) {
        if (!$user->isLogged()) {
            throw new Exception('User is not logged');
        }
        ///...
    }

    function sendMessage(User $recipient, Message $messageSend) {
        if (!$user->isLogged()) {
            throw new Exception('User is not logged');
        }
        ///...
    }
}

```

##### Right

```
<?

final class SocialNetwork {

    function postStatus(string $newStatus) {
        $this->assertUserIsLogged();
        ///...
    }

    function uploadProfilePicture(Picture $newPicture) {
        $this->assertUserIsLogged();
        ///...
    }

    function sendMessage(User $recipient, Message $messageSend) {
        $this->assertUserIsLogged();
        ///...
    }

    function assertUserIsLogged() {
        if (!$this->user->isLogged()) {
            throw new Exception('User is not logged');
            //This is just a simplification to show the code smell
            //Operations should be defined as objects with preconditions etc.
        }
    }
}

```

## Detection

Some modern linters can detect repeated patterns (not just repeated code) and also while performing our code reviews we can easily detect this problem and ask for a refactor.

## Tags

- Code Duplication

## Conclusion

Adding a new feature should be straightforward in our model maps 1:1 to real world and our responsibilities are in the correct places.
We should be alert for small changes spanning several classes.