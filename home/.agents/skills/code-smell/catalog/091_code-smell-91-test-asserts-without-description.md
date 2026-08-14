# Code Smell 91 - Test Asserts without Description

We are big fans of xUnit. But we don't care much for the programmers.

**TL;DR:** Use asserts with declarative descriptions.

## Problems

- Readability

- Hard debugging

- Time waste

## Solutions

- Put a nice descriptive assertion

- Share guides for problem-solving

## Sample Code

##### Wrong

```
<?

public function testNoNewStarsAppeared(): void
  {
     $expectedStars = $this->historicStarsOnFrame();
     $observedStars = $this->starsFromObservation();
     //These sentences get a very large collection

     $this->assertEquals($expectedStars, $observedStars);
     //If something fails we will have a very hard debugging time
    }

```

##### Right

```
<?

public function testNoNewStarsAppeared(): void
  {
     $expectedStars = $this->historicStarsOnFrame();
     $observedStars = $this->starsFromObservation();
     //These sentences get a very large collection

     $newStars = array_diff($expectedStars, $observedStars);

     $this->assertEquals($expectedStars, $observedStars ,
         'There are new stars ' . print_r($newStars,true));
     //Now we can see EXACTLY why the assertion failed with a clear and
     //Declarative Message
    }

```

## Detection

Since assert and assertDescription are different functions, we can adjust our policies to favour the latter.

## Tags

- Test Smells

## Conclusion

Be respectful to the reader of your assertions.

It might even be yourself!