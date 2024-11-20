const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like HTML) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the POST request when the button is clicked
app.post('/post-data', (req, res) => {
  console.log('Received POST request:', req.body);
  res.send({ message: 'Button clicked!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
