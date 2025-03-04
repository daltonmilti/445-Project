require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS for frontend requests

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Endpoints

// GET all Travelers
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

// POST a new Traveler
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

// GET all Hotels
app.get('/api/hotels', (req, res) => {
  const sql = 'SELECT * FROM Hotel';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Flights (joining with Airline for details)
app.get('/api/flights', (req, res) => {
  const sql = `
    SELECT F.*, A.airlineName 
    FROM Flight F 
    JOIN Airline A ON F.airline = A.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Activities
app.get('/api/activities', (req, res) => {
  const sql = 'SELECT * FROM Activity';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Reviews
app.get('/api/reviews', (req, res) => {
  const sql = 'SELECT * FROM Review';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Reservations
app.get('/api/reservations', (req, res) => {
  const sql = 'SELECT * FROM Reservation';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Rental Cars (joining with Car for details)
app.get('/api/rentalcars', (req, res) => {
  const sql = `
    SELECT RC.*, C.carModel, C.carType
    FROM RentalCar RC
    JOIN Car C ON RC.carID = C.carID
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// GET all Travel Agents
app.get('/api/travelagents', (req, res) => {
  const sql = 'SELECT * FROM TravelAgent';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
