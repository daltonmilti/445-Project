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

// -------------------- Standard Endpoints --------------------

// GET all Travelers
app.get('/api/travelers', (req, res) => {
  const sql = 'SELECT * FROM Traveler';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new Traveler
app.post('/api/travelers', (req, res) => {
  const { id, firstName, lastName, eMail, phoneNumber } = req.body;
  const sql = 'INSERT INTO Traveler (id, firstName, lastName, eMail, phoneNumber) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id, firstName, lastName, eMail, phoneNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Traveler added successfully', result });
  });
});

// GET all Hotels
app.get('/api/hotels', (req, res) => {
  const sql = 'SELECT * FROM Hotel';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
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
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all Activities
app.get('/api/activities', (req, res) => {
  const sql = 'SELECT * FROM Activity';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all Reviews
app.get('/api/reviews', (req, res) => {
  const sql = 'SELECT * FROM Review';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all Reservations
app.get('/api/reservations', (req, res) => {
  const sql = 'SELECT * FROM Reservation';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
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
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all Travel Agents
app.get('/api/travelagents', (req, res) => {
  const sql = 'SELECT * FROM TravelAgent';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// -------------------- Analytical Endpoints --------------------

// 1. Popular Destinations: Based on number of bookings and average review ratings.
app.get('/api/analytics/popular-destinations', (req, res) => {
  const sql = `
    SELECT H.city AS Destination,
           COUNT(R.reservationID) AS TotalBookings,
           AVG(IFNULL(Rev.rating, 0)) AS AvgRating
    FROM Hotel H
    LEFT JOIN Reservation R ON R.reservationName LIKE CONCAT('%', H.hotelName, '%')
    LEFT JOIN Review Rev ON Rev.reviewedEntityType = 'Hotel' AND Rev.reviewedEntityID = H.hotelID
    GROUP BY H.city
    ORDER BY TotalBookings DESC, AvgRating DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: 'Popular destinations based on bookings and reviews',
      data: results
    });
  });
});

// 2. Cancellations & Refunds: Counts of cancellations and refund requests.
app.get('/api/analytics/cancellations-refunds', (req, res) => {
  const cancellationSql = `SELECT COUNT(*) AS TotalCancellations FROM Cancellation`;
  const refundSql = `SELECT COUNT(*) AS TotalRefunds FROM RefundRequest`;
  db.query(cancellationSql, (err, cancelResults) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(refundSql, (err, refundResults) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: 'Total cancellations and refunds (time grouping not available)',
        cancellations: cancelResults[0],
        refunds: refundResults[0]
      });
    });
  });
});

// 3. Highest Activity: Example query based on hotel check-in times.
app.get('/api/analytics/highest-activity', (req, res) => {
  const sql = `
    SELECT MONTH(checkInTime) AS Month,
           COUNT(*) AS HotelCheckIns
    FROM Hotel
    WHERE checkInTime IS NOT NULL
    GROUP BY MONTH(checkInTime)
    ORDER BY HotelCheckIns DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: 'Hotel check-in activity by month',
      data: results
    });
  });
});

// 4. Customer Spending Patterns: Based on number of paid bookings.
app.get('/api/analytics/customer-spending', (req, res) => {
  const sql = `
    SELECT T.id AS TravelerID,
           T.firstName,
           T.lastName,
           SUM(CASE WHEN P.status='Paid' THEN 1 ELSE 0 END) AS TotalPaidBookings
    FROM Traveler T
    LEFT JOIN Reservation R ON T.id = R.customerID
    LEFT JOIN Payment P ON R.reservationID = P.reservationID
    GROUP BY T.id, T.firstName, T.lastName
    ORDER BY TotalPaidBookings DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: 'Customer spending patterns (based on paid bookings)',
      data: results
    });
  });
});

// 5. Discount Impact: Comparing bookings for discounted versus non-discounted travel packages.
app.get('/api/analytics/discount-impact', (req, res) => {
  const sql = `
    SELECT 
       CASE WHEN PD.packageID IS NOT NULL THEN 'Discounted' ELSE 'Non-Discounted' END AS DiscountStatus,
       COUNT(DISTINCT R.reservationID) AS TotalReservations
    FROM TravelPackage TP
    LEFT JOIN PackageDiscount PD ON TP.packageID = PD.packageID
    LEFT JOIN Reservation R 
      ON (TP.flightReservationID = R.reservationID 
       OR TP.hotelReservationID = R.reservationID
       OR TP.rentalCarReservationID = R.reservationID)
    GROUP BY DiscountStatus
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: 'Impact of discounts on bookings',
      data: results
    });
  });
});

// -------------------- Typical Scenarios Endpoints --------------------

// 1. Search for Services: (Hardcoded for New York)
// Searches for hotels (with rating >= 4.0), flights (departing from New York),
// and activities (in New York).
app.get('/api/typical/search-services', (req, res) => {
  const hotelsSql = `SELECT * FROM Hotel WHERE city = 'New York' AND averageRating >= 4.0`;
  const flightsSql = `
    SELECT F.*, A.airlineName
    FROM Flight F
    JOIN Airline A ON F.airline = A.id
    WHERE F.departureCity = 'New York'
  `;
  const activitiesSql = `
    SELECT A.*
    FROM Activity A
    JOIN TravelerActivity TA ON A.id = TA.activityID
    JOIN Location L ON TA.locationID = L.locationID
    WHERE L.city = 'New York'
  `;
  db.query(hotelsSql, (err, hotels) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(flightsSql, (err, flights) => {
      if (err) return res.status(500).json({ error: err.message });
      db.query(activitiesSql, (err, activities) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          message: "Search results for services in New York",
          hotels,
          flights,
          activities
        });
      });
    });
  });
});

// 2. Book a Travel Service: (Simulated response)
app.get('/api/typical/book-service', (req, res) => {
  res.json({
    message: "Booking successful: Reservation RS1110 created for traveler T100 for a hotel booking."
  });
});

// 3. Manage Bookings: (Simulated by retrieving reservations for traveler T100)
app.get('/api/typical/manage-bookings', (req, res) => {
  const sql = `SELECT * FROM Reservation WHERE customerID = 'T100'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Managing bookings for traveler T100",
      reservations: results
    });
  });
});

// 4. Process Payment: (Simulated response)
app.get('/api/typical/process-payment', (req, res) => {
  res.json({
    message: "Payment processed: Reservation RS1100 paid using Credit Card on 2025-03-01."
  });
});

// 5. Leave a Review: (Simulated response)
app.get('/api/typical/leave-review', (req, res) => {
  res.json({
    message: "Review submitted for Hotel H500 by traveler T100: 'Excellent service and clean rooms!'"
  });
});

// 6. Receive Notifications: (Retrieves notifications for traveler T100)
app.get('/api/typical/receive-notifications', (req, res) => {
  const sql = `SELECT * FROM Notification WHERE travelerID = 'T100'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Notifications for traveler T100",
      notifications: results
    });
  });
});

// 7. Contact a Travel Agent: (Retrieves details for a hardcoded travel agent)
app.get('/api/typical/contact-agent', (req, res) => {
  const sql = `SELECT * FROM TravelAgent WHERE agentID = 'TA1800'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Contact travel agent for itineraries and travel packages",
      agent: results.length ? results[0] : "No agent found"
    });
  });
});

// -------------------- End Typical Scenarios Endpoints --------------------

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
