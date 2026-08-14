# Code Smell 58 - Yo-yo Problem

Searching for a concrete method implementation? Go back and forth, up and down.

**TL;DR:** Don't ab(use) hierarchies.

## Problems

- Deep Hierarchies

- Subclassification for Code Reuse

- Readability

- Low Cohesion

- High Coupling

## Solutions

- Favor composition over inheritance.

- Refactor deep hierarchies.

## Sample Code

##### Wrong

```
<?

abstract class Controller {

}

class BaseController extends Controller {

}

class SimpleController extends BaseController {

}

class ControllerBase extends SimpleController {

}

class LoggedController extends ControllerBase {

}

class RealController extends LoggedController {

}

```

##### Right

```
<?

interface ControllerInterface {

}

abstract class Controller implements ControllerInterface {

}

final class LoggedControllerDecorator implements ControllerInterface {

}

final class RealController implements ControllerInterface {

}

```

## Detection

Any linter can check for suspects against a max depth threshold.

## Tags

- Hierarchy

## Conclusion

Many novice programmers reuse code through hierarchies. This brings high coupled and low cohesive hierarchies.

Johnson and Foote established in their paper this was actually a good design recipe back in 1988. We have learned a lot from there.

We must refactor and flatten those classes.

## Relations

[https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse](https://maximilianocontieri.com/code-smell-11-subclassification-for-code-reuse)