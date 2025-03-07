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

// --- Analytical Endpoints ---

// 1. Duplicate Bookings: Hardcoded example
app.get('/api/analytics/duplicate-bookings', (req, res) => {
  const customerID = 'T100';
  const reservationName = 'Spring Break Flight';
  const reservationType = 'Flight';
  const sql = `
    SELECT *
    FROM Reservation
    WHERE customerID = ? AND reservationName = ? AND reservationType = ?
  `;
  db.query(sql, [customerID, reservationName, reservationType], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      res.json({
        message: `Duplicate booking detected for customer ${customerID} with reservation '${reservationName}' (${reservationType}).`,
        duplicateBookings: results
      });
    } else {
      res.json({
        message: `No duplicate booking found for customer ${customerID} with reservation '${reservationName}' (${reservationType}).`,
        duplicateBookings: []
      });
    }
  });
});

// 2. Cancellation Policies: Hardcoded example
app.get('/api/analytics/cancellation-policy', (req, res) => {
  const sql = `
    SELECT *
    FROM Policy
    WHERE type = 'Cancellation'
      AND CURDATE() BETWEEN effectiveDate AND expiryDate
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 3. Dynamic Pricing: Hardcoded example using booking counts
app.get('/api/analytics/dynamic-pricing', (req, res) => {
  const sql = `
    SELECT H.hotelID, H.hotelName, COUNT(R.reservationID) AS bookingCount
    FROM Hotel H
    LEFT JOIN Reservation R ON R.reservationName LIKE CONCAT('%', H.hotelName, '%')
    GROUP BY H.hotelID
  `;
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 4. Itinerary Optimization: Hardcoded example for New York
app.get('/api/analytics/itinerary', (req, res) => {
  const city = 'New York';
  const hotelsSql = `SELECT hotelName, city FROM Hotel WHERE city = ?`;
  const flightsSql = `
    SELECT F.id AS flightID, F.departureCity, A.airlineName
    FROM Flight F
    JOIN Airline A ON F.airline = A.id
    WHERE F.departureCity = ?
  `;
  db.query(hotelsSql, [city], (err, hotels) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    db.query(flightsSql, [city], (err, flights) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ hotels, flights });
    });
  });
});

// 5. Customer Support Escalation: Hardcoded example for open support tickets
app.get('/api/analytics/support-escalation', (req, res) => {
  const sql = `
    SELECT *
    FROM SupportTicket
    WHERE status = 'Open'
  `;
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
