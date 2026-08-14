# Code Smell 253 - Silent Truncation

**TL;DR:** If you limit text lengths, enforce them everywhere!

## Problems

- The Fail Fast Principle Violation

- Corrupted and Missing Data

- Bijection Fault

- UTF-8 Truncation

- The Least Surprise principle violation

- Separation of Concerns of the UI and the Model

## Solutions

- Be consistent with length rules

- Enforce the rules in the domain objects

## Sample Code

##### Wrong

```
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// The page architecture is over simplified
const db = require('./db');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/save-data', (req, res) => {
  const fullText = req.body.fullText;
  const truncatedText = fullText.slice(0, 255);
  // This truncation is not explicit sometimes

  db.query('INSERT INTO table_name (truncated_text) VALUES (?)',
           [truncatedText], (err, result) => {
    if (err) throw err;
    res.send('Data saved successfully');
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));

<!DOCTYPE html>
<html>
<head>
  <title>Penrose Theory on Quantum Consciousness</title>
  <script>
    const form = document.getElementById('textForm');
    const textArea = document.getElementById('textArea');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fullText = textArea.value;

      if (fullText.length > 1000) {
        alert('Text cannot exceed 1000 characters');
        return;
      }

      fetch('/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `fullText=${encodeURIComponent(fullText)}`
      })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    });
  </script>
</head>
<body>
  <h1>Penrose Theory on Quantum Consciousness</h1>
  <form id="textForm">
    <textarea id="textArea"
      rows="10"
      placeholder="Enter text about Penrose's theory (max 1000 characters)">
    </textarea>
    <button type="submit">Save</button>
  </form>
</body>
</html>

```

##### Right

```
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const db = require('./db');

// You should defined this constant in the backend
// Hopefully in a domain object
const MAX_CHARS = 255;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/max-chars', (req, res) => {
  res.json({ maxChars: MAX_CHARS });
});

app.post('/save-data', (req, res) => {
  const fullText = req.body.fullText;
  const truncatedText = fullText.slice(0, MAX_CHARS);

  db.query('INSERT INTO table_name (truncated_text) VALUES (?)',
           [truncatedText], (err, result) => {
    if (err) throw err;
    res.send('Data saved successfully');
  });
});

// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

<!DOCTYPE html>
<html>
<head>
  <title>Penrose Theory on Quantum Consciousness</title>
  <script>
    let maxChars;

    fetch('/max-chars')
      .then(response => response.json())
      .then(data => {
        maxChars = data.maxChars;
        const form = document.getElementById('textForm');
        const textArea = document.getElementById('textArea');

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const fullText = textArea.value;

          if (fullText.length > maxChars) {
            alert(`Text cannot exceed ${maxChars} characters`);
            return;
          }

          fetch('/save-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `fullText=${encodeURIComponent(fullText)}`
          })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
        });
      })
      .catch(error => console.error('Error:', error));
  </script>
</head>
<body>
  <h1>Penrose Theory on Quantum Consciousness</h1>
  <form id="textForm">
    <textarea id="textArea"
      rows="10"
      placeholder="Enter text about Penrose's theory">
    </textarea>
    <button type="submit">Save</button>
  </form>
</body>
</html>

```

## Detection

[X] Semi-Automatic

You can do boundary testing. For example, using Zombies methodology

## Tags

- Fail Fast

## Conclusion

You need to handle a clear separation of concerns between the client-side (UI) and server-side (database operations).

The client-side handles user input validation and displaying data, while the server-side handles data storage and retrieval from the database.

You defined the maximum character limit in the backend and fetched by the client-side making it easier to update or change the limit across the application without modifying the client-side code and having ripple effect.

## Relations

[https://maximilianocontieri.com/code-smell-139-business-code-in-the-user-interface](https://maximilianocontieri.com/code-smell-139-business-code-in-the-user-interface)