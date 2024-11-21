const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Database connection configuration
const dbConfig = {
  host: 'aws-assignment-rds-db.cluster-c5eq8e8k6g5r.us-east-2.rds.amazonaws.com',
  user: 'root',  // replace with your DB username
  password: 'root-password',  // replace with your DB password
};

// Create a connection to the MySQL server (without specifying the database yet)
const connection = mysql.createConnection(dbConfig);

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like HTML) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to check and create the schema and tables if they don't exist
const checkAndCreateSchemaAndTables = () => {
  // First, ensure the database/schema exists
  connection.query(`CREATE DATABASE IF NOT EXISTS entries_db`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }

    // Now, use the database to check for tables and create them if necessary
    connection.changeUser({ database: 'entries_db' }, (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        return;
      }

      // Check if the table exists, if not create it
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS entries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        } else {
          console.log('Schema and table checked/created successfully.');
        }
      });
    });
  });
};

// Call the function to check schema and table
checkAndCreateSchemaAndTables();

// Handle the POST request when the button is clicked
app.post('/post-data', (req, res) => {
  console.log('Received POST request:', req.body);

  // Example: Insert data into the table (id and created_at are handled automatically)
  const insertQuery = `
    INSERT INTO entries ()
    VALUES ()
  `;

  connection.execute(insertQuery, (err, results) => {
    if (err) {
      console.error('Error executing insert query:', err);
      return res.status(500).send({ message: 'Error inserting data' });
    }

    console.log('Data inserted successfully:', results);
    res.send({ message: 'Button clicked and data processed!' });
  });
});

// Handle the GET request to retrieve data from the 'entries' table
app.get('/get-data', (req, res) => {
  console.log('Received GET request to retrieve data');

  const selectQuery = 'SELECT * FROM entries ORDER BY created_at DESC'; // Retrieve all entries, ordered by created_at
  
  connection.execute(selectQuery, (err, results) => {
    if (err) {
      console.error('Error executing select query:', err);
      return res.status(500).send({ message: 'Error retrieving data' });
    }

    console.log('Data retrieved successfully:', results);
    res.json(results); // Send the data as JSON
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
