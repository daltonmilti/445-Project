require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for frontend requests

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',  // Change this if running on a remote server
  user: 'root',       // Your MySQL username
  password: 'password', // Your MySQL password
  database: 'db' // Your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Sample API endpoint to fetch all travelers
app.get('/api/travelers', (req, res) => {
  const sql = 'SELECT * FROM Traveler';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Sample API endpoint to add a traveler
app.post('/api/travelers', (req, res) => {
  const { id, firstName, lastName, eMail, phoneNumber } = req.body;
  const sql = 'INSERT INTO Traveler (id, firstName, lastName, eMail, phoneNumber) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id, firstName, lastName, eMail, phoneNumber], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Traveler added successfully', result });
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
