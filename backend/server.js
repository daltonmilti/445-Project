const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

// Create a connection pool to your MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',      // Replace with your MySQL username
  password: 'your_password',  // Replace with your MySQL password
  database: 'miltimorephan_daltonbrandon_queries',
  connectionLimit: 10
});

// Example endpoint: Retrieve hotels in New York with a rating of 4.0 or higher
app.get('/api/hotels', (req, res) => {
  const query = `
    SELECT hotelID, hotelName, city, averageRating
    FROM Hotel
    WHERE city = 'New York' AND averageRating >= 4.0;
  `;
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching hotels:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

// Additional endpoints (for flights, reservations, etc.) can be added here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
