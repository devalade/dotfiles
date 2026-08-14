# Code Smell 148 - ToDos

**TL;DR:** Don't leave TODOs in your code. Fix them!

## Problems

- Technical Debt

- Readability

- Lack of Confidence

## Solutions

- Fix your TODOs

## Sample Code

##### Wrong

```
public class Door
{
    private Boolean isOpened;

    public Door(boolean isOpened)
    {
        this.isOpened = isOpened;
    }

    public void openDoor()
    {
        this.isOpened = true;
    }

    public void closeDoor()
    {
        // TODO: Implement close door and cover it
    }

}

```

##### Right

```
public class Door
{

    private Boolean isOpened;

    public Door(boolean isOpened)
    {
        this.isOpened = isOpened;
    }

    public void openDoor()
    {
        this.isOpened = true;
    }

    public void closeDoor()
    {
        this.isOpened = false;
    }

}

```

## Detection

[X] Automatic

We can count TODOs.

## Tags

- Technical Debt

## Conclusion

We can count TODOs.

Most linters do it.

We need the policy to reduce them.

If we are using TDD, we write the missing code right away.

In this context, TODOs are only valid when doing Depth First development to remember open paths to visit.