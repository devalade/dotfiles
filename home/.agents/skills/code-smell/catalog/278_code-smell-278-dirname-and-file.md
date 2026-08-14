# Code Smell 278 - DirName and File

fileName

**TL;DR:** Use clear names for better code understanding.

## Problems

- Unclear variable purpose
- Bijection Fault
- Misleading context
- Repetitive code
- Harder maintenance
- Reduced readability
- Abbreviations
- Increased cognitive load

## Solutions

- Honor the Bijection
- Use precise names
- Avoid ambiguity
- Keep context clear
- Extract reusable code
- Follow naming conventions
- Reify names with their rules

## Sample Code

##### Wrong

```
function importBoardGameScores(file) {
  if (file) {
    const data = fs.readFileSync(file, 'utf-8');
    // Process board game scores...
  }
}

function importDirectoryScores(dirName) {
  // 'dir' is an abbreviation
  const files = fs.readdirSync(dirName);
  files.forEach(file => {
    const data = fs.readFileSync(`${dirName}/${file}`, 'utf-8');
    // Process each file's board game scores...
  });
  }
}

```

##### Right

```
function importBoardGameScores(fileName) {
  if (fileName) {
    const data = fs.readFileSync(fileName, 'utf-8');
    // Process board game scores...
  }
}

function importDirectoryBoardGamesScores(directoryPath) {
    const fileNames = fs.readdirSync(directoryPath);
    // Note the variable holding filenames
    // and not files

   fileNames.forEach(filename => {
        const fullPath = path.join(directoryPath, filename);
        const scores = importBoardGameScores(fullPath);
        allScores.push(scores);
   });

   return allScores.flat();

// You can also reify the concept of a filename
// And avoid repeating the rules everywhere

class Filename {
    value;

    constructor(value) {
        this.validateFilename(value);
        this.value = value;
    }

    validateFilename(value) {
        const invalidCharacters = /[<>:"/\\|?*\x00-\x1F]/g;
        if (invalidCharacters.test(value)) {
            throw new Error
              ('Filename contains invalid characters');
        }

        if (/^[. ]+$/.test(value)) {
            throw new Error
              ('Filename cannot consist only of dots or spaces');
        }

        if (value.length > 255) {
            throw new Error
              ('Filename is too long');
        }
    }

    toString() {
        return this.value;
    }

    get value() {
        return this.value;
    }
}

```

## Detection

[X] Semi-Automatic

Look for generic names in code handling files or directory paths like file or dirName.

## Tags

- Naming

## Conclusion

By using precise names like fileName and directoryPath and extracting reusable methods, you improve code clarity and maintainability.

These simple practices help reduce redundancy and keep your code understandable.

## Relations

[https://maximilianocontieri.com/code-smell-33-abbreviations](https://maximilianocontieri.com/code-smell-33-abbreviations)