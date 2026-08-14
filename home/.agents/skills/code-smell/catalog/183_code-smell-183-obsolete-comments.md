# Code Smell 183 - Obsolete Comments

**TL;DR:** Don't trust comments. They are dead.

## Problems

- Bad documentation

- Maintainability

## Solutions

- Replace comments with tests

## Exceptions

- Very important design decisions

## Sample Code

##### Wrong

```
void Widget::displayPlugin(Unit* unit)
{

  // TODO the Plugin will be modified soon, so I don't implement this right now

  if (!isVisible) {
      // hide all widgets
      return;
  }
}

```

##### Right

```
void Widget::displayPlugin(Unit* unit)
{

 if (!isVisible) {
    return;
 }

}

```

## Detection

[X] Semi-Automatic

We can warn for comments in our code and try to remove them.

## Tags

- Comments

## Conclusion

We need to think before adding a comment. Once It is in the codebase is beyond our control and can start to lie anytime.

## Relations

[https://maximilianocontieri.com/code-smell-05-comment-abusers](https://maximilianocontieri.com/code-smell-05-comment-abusers)
[https://maximilianocontieri.com/code-smell-152-logical-comment](https://maximilianocontieri.com/code-smell-152-logical-comment)

[https://maximilianocontieri.com/code-smell-151-commented-code](https://maximilianocontieri.com/code-smell-151-commented-code)