# Code Smell 100 - GoTo

GOTO was considered harmful 50 years ago

**TL;DR:** Don't ever use GoTo.

## Problems

- Readability

- Hard to follow code

## Solutions

- Replace GOTO with structured code

- Use exceptions

## Sample Code

##### Wrong

```
for x < 0 {
    if x > -1e-09 {
      goto small
    }
    z = z / x
    x = x + 1
  }
  for x < 2 {
    if x < 1e-09 {
      goto small
    }
    z = z / x
    x = x + 1
  }

  if x == 2 {
    return z
  }

  x = x - 2
  p = (((((x*_gamP[0]+_gamP[1])*x+_gamP[2])*x+_gamP[3])*x+_gamP[4])*x+_gamP[5])*x + _gamP[6]
  q = ((((((x*_gamQ[0]+_gamQ[1])*x+_gamQ[2])*x+_gamQ[3])*x+_gamQ[4])*x+_gamQ[5])*x+_gamQ[6])*x + _gamQ[7]
  return z * p / q

small:
  if x == 0 {
    return Inf(1)
  }
  return z / ((1 + Euler*x) * x)
}

```

##### Right

```
for x < 0 {
    if x > -1e-09 {
      return small(x, z)
    }
    z = z / x
    x = x + 1
  }
  for x < 2 {
    if x < 1e-09 {
      return small(x, z)
    }
    z = z / x
    x = x + 1
  }

  if x == 2 {
    return z
  }

  x = x - 2
  p = (((((x*_gamP[0]+_gamP[1])*x+_gamP[2])*x+_gamP[3])*x+_gamP[4])*x+_gamP[5])*x + _gamP[6]
  q = ((((((x*_gamQ[0]+_gamQ[1])*x+_gamQ[2])*x+_gamQ[3])*x+_gamQ[4])*x+_gamQ[5])*x+_gamQ[6])*x + _gamQ[7]
  return z * p / q

small(x, z){
  if x == 0 {
     return Inf(1)
   }
   return z / ((1 + Euler*x) * x)
 }
}

```

## Detection

[X] Automatic

In languages supporting GOTO, our linters can warn us against its usage.

## Tags

- Readability

## Conclusion

We acknowledged GOTO problems a few decades ago.

The problem is still present in modern languages.

Most programmers luckily avoid GOTO sentence. Next goal will be to consider harmful null usage.

Courtesy XKCD

## Relations

[https://maximilianocontieri.com/code-smell-12-null](https://maximilianocontieri.com/code-smell-12-null)