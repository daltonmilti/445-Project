
-- 1. Create the Database and Name it
CREATE DATABASE db;
USE db;

-- 2. Create All Tables

-- (1) Traveler
CREATE TABLE Traveler (
  id            VARCHAR(36)    NOT NULL,
  firstName     VARCHAR(50)    NOT NULL,
  lastName      VARCHAR(50)    NOT NULL,
  eMail         VARCHAR(100),
  phoneNumber   VARCHAR(30),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- (2) Activity
CREATE TABLE Activity (
  id            VARCHAR(36)    NOT NULL,
  name          VARCHAR(100)   NOT NULL,
  description   VARCHAR(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- (3) Airline
CREATE TABLE Airline (
  id            VARCHAR(36)   NOT NULL,
  airlineName   VARCHAR(100)  NOT NULL,
  country       VARCHAR(50),
  IATACode      VARCHAR(10),
  hubAirport    VARCHAR(50),
  website       VARCHAR(100),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- (4) Flight
CREATE TABLE Flight (
  id              VARCHAR(36)    NOT NULL,
  airline         VARCHAR(36)    NOT NULL,
  departureCity   VARCHAR(100),
  PRIMARY KEY (id),
  CONSTRAINT fk_flight_airline
    FOREIGN KEY (airline)
    REFERENCES Airline(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (5) Hotel
CREATE TABLE Hotel (
  hotelID        VARCHAR(36)    NOT NULL,
  hotelName      VARCHAR(100)   NOT NULL,
  city           VARCHAR(50),
  country        VARCHAR(50),
  averageRating  DECIMAL(3,2),
  numberOfRooms  INT,
  amenities      VARCHAR(255),
  contactNumber  VARCHAR(30),
  email          VARCHAR(100),
  website        VARCHAR(100),
  checkInTime    DATETIME,
  checkOutTime   DATETIME,
  HotelChain     VARCHAR(100),
  PRIMARY KEY (hotelID)
) ENGINE=InnoDB;

-- (6) Room
CREATE TABLE Room (
  roomID             VARCHAR(36)     NOT NULL,
  hotelID            VARCHAR(36)     NOT NULL,
  roomNumber         VARCHAR(10),
  bedType            VARCHAR(50),
  capacity           INT,
  pricePerNight      DECIMAL(10,2),
  availabilityStatus VARCHAR(50),
  viewType           VARCHAR(50),
  amenities          VARCHAR(255),
  floor              INT,
  size               DECIMAL(6,2),
  PRIMARY KEY (roomID),
  CONSTRAINT fk_room_hotel
    FOREIGN KEY (hotelID)
    REFERENCES Hotel(hotelID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (7) Car
CREATE TABLE Car (
  carID           VARCHAR(36)   NOT NULL,
  carModel        VARCHAR(100),
  carType         VARCHAR(50),
  seatingCapacity INT,
  fuelType        VARCHAR(50),
  transmission    VARCHAR(50),
  licensePlate    VARCHAR(50),
  color           VARCHAR(50),
  year            YEAR,
  PRIMARY KEY (carID)
) ENGINE=InnoDB;

-- (8) RentalCarCompany
CREATE TABLE RentalCarCompany (
  companyID      VARCHAR(36)   NOT NULL,
  companyName    VARCHAR(100),
  headquarters   VARCHAR(100),
  contactNumber  VARCHAR(30),
  email          VARCHAR(100),
  website        VARCHAR(100),
  fleetSize      INT,
  averageRating  DECIMAL(3,2),
  policies       VARCHAR(255),
  loyaltyProgram VARCHAR(100),
  PRIMARY KEY (companyID)
) ENGINE=InnoDB;

-- Decompose multivalued attributes:
-- 8a) RentalCarCompanyOperatingCountry
CREATE TABLE RentalCarCompanyOperatingCountry (
  companyID  VARCHAR(36) NOT NULL,
  country    VARCHAR(50) NOT NULL,
  PRIMARY KEY (companyID, country),
  CONSTRAINT fk_rcc_country
    FOREIGN KEY (companyID)
    REFERENCES RentalCarCompany(companyID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8b) RentalCarCompanyLocation
CREATE TABLE RentalCarCompanyLocation (
  companyID     VARCHAR(36) NOT NULL,
  locationName  VARCHAR(100) NOT NULL,
  PRIMARY KEY (companyID, locationName),
  CONSTRAINT fk_rcc_location
    FOREIGN KEY (companyID)
    REFERENCES RentalCarCompany(companyID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (9) RentalCar
CREATE TABLE RentalCar (
  rentalCarID        VARCHAR(36)   NOT NULL,
  carID              VARCHAR(36)   NOT NULL,
  companyID          VARCHAR(36)   NOT NULL,
  rentalPricePerDay  DECIMAL(10,2),
  mileageLimitPerDay DECIMAL(10,2),
  availabilityStatus VARCHAR(50),
  pickupLocation     VARCHAR(100),
  insuranceIncluded  VARCHAR(5),
  PRIMARY KEY (rentalCarID),
  CONSTRAINT fk_rc_car
    FOREIGN KEY (carID)
    REFERENCES Car(carID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_rc_company
    FOREIGN KEY (companyID)
    REFERENCES RentalCarCompany(companyID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (10) TravelInsurance
CREATE TABLE TravelInsurance (
  insuranceID        VARCHAR(36) NOT NULL,
  travelerID         VARCHAR(36),
  insuranceProviderID VARCHAR(36),
  policyName         VARCHAR(100),
  coverageType       VARCHAR(50),
  coverageAmount     DECIMAL(10,2),
  premiumCost        DECIMAL(10,2),
  duration           VARCHAR(50),
  startDate          DATE,
  endDate            DATE,
  contactNumber      VARCHAR(30),
  claimProcess       VARCHAR(255),
  policyTerms        VARCHAR(255),
  averageRating      DECIMAL(3,2),
  PRIMARY KEY (insuranceID),
  CONSTRAINT fk_ins_traveler
    FOREIGN KEY (travelerID)
    REFERENCES Traveler(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (11) Reservation
CREATE TABLE Reservation (
  reservationID   VARCHAR(36) NOT NULL,
  customerID      VARCHAR(36) NOT NULL,
  reservationName VARCHAR(100),
  reservationType VARCHAR(50),
  PRIMARY KEY (reservationID),
  CONSTRAINT fk_res_traveler
    FOREIGN KEY (customerID)
    REFERENCES Traveler(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (12) Discount
CREATE TABLE Discount (
  discountID          VARCHAR(36) NOT NULL,
  discountName        VARCHAR(100),
  discountDescription VARCHAR(255),
  percentageOff       DECIMAL(5,2),
  PRIMARY KEY (discountID)
) ENGINE=InnoDB;

-- (13) Notification
CREATE TABLE Notification (
  notificationID      VARCHAR(36) NOT NULL,
  travelerID          VARCHAR(36),
  notificationTitle   VARCHAR(100),
  notificationMessage VARCHAR(255),
  PRIMARY KEY (notificationID),
  CONSTRAINT fk_notif_traveler
    FOREIGN KEY (travelerID)
    REFERENCES Traveler(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (14) Payment
CREATE TABLE Payment (
  paymentID     VARCHAR(36) NOT NULL,
  reservationID VARCHAR(36),
  method        VARCHAR(50),
  date          DATE,
  status        VARCHAR(50),
  PRIMARY KEY (paymentID),
  CONSTRAINT fk_pay_res
    FOREIGN KEY (reservationID)
    REFERENCES Reservation(reservationID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (15) Policy
CREATE TABLE Policy (
  policyID       VARCHAR(36) NOT NULL,
  type           VARCHAR(50),
  description    VARCHAR(255),
  effectiveDate  DATE,
  expiryDate     DATE,
  PRIMARY KEY (policyID)
) ENGINE=InnoDB;

-- (16) Cancellation
CREATE TABLE Cancellation (
  cancellationID     VARCHAR(36) NOT NULL,
  customerID         VARCHAR(36),
  policyID           VARCHAR(36),
  cancellationReason VARCHAR(255),
  penalties          VARCHAR(255),
  PRIMARY KEY (cancellationID),
  CONSTRAINT fk_canc_traveler
    FOREIGN KEY (customerID)
    REFERENCES Traveler(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_canc_policy
    FOREIGN KEY (policyID)
    REFERENCES Policy(policyID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (17) RefundRequest
CREATE TABLE RefundRequest (
  refundID      VARCHAR(36) NOT NULL,
  customerID    VARCHAR(36),
  policyID      VARCHAR(36),
  refundReason  VARCHAR(255),
  penalties     VARCHAR(255),
  PRIMARY KEY (refundID),
  CONSTRAINT fk_ref_traveler
    FOREIGN KEY (customerID)
    REFERENCES Traveler(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_ref_policy
    FOREIGN KEY (policyID)
    REFERENCES Policy(policyID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (18) TravelAgent
CREATE TABLE TravelAgent (
  agentID    VARCHAR(36) NOT NULL,
  agentName  VARCHAR(100),
  agency     VARCHAR(100),
  PRIMARY KEY (agentID)
) ENGINE=InnoDB;

-- (19) Location
CREATE TABLE Location (
  locationID    VARCHAR(36) NOT NULL,
  locationName  VARCHAR(100),
  city          VARCHAR(50),
  region        VARCHAR(50),
  country       VARCHAR(50),
  airportCode   VARCHAR(10),
  PRIMARY KEY (locationID)
) ENGINE=InnoDB;

-- (20) TravelerActivity
CREATE TABLE TravelerActivity (
  travelerID          VARCHAR(36) NOT NULL,
  activityID          VARCHAR(36) NOT NULL,
  locationID          VARCHAR(36) NOT NULL,
  dateVisited         DATE,
  activityDescription VARCHAR(255),
  PRIMARY KEY (travelerID, activityID, locationID),
  CONSTRAINT fk_ta_traveler
    FOREIGN KEY (travelerID)
    REFERENCES Traveler(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ta_activity
    FOREIGN KEY (activityID)
    REFERENCES Activity(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ta_location
    FOREIGN KEY (locationID)
    REFERENCES Location(locationID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (21) Review
CREATE TABLE Review (
  reviewID           VARCHAR(36) NOT NULL,
  name               VARCHAR(100),
  description        VARCHAR(255),
  rating             DECIMAL(3,2),
  author             VARCHAR(100),
  reviewedEntityType VARCHAR(50),
  reviewedEntityID   VARCHAR(36),
  PRIMARY KEY (reviewID)
) ENGINE=InnoDB;

-- (22) TravelPackage
CREATE TABLE TravelPackage (
  packageID               VARCHAR(36) NOT NULL,
  packageName             VARCHAR(100),
  flightReservationID     VARCHAR(36),
  hotelReservationID      VARCHAR(36),
  rentalCarReservationID  VARCHAR(36),
  agentID                 VARCHAR(36),
  PRIMARY KEY (packageID),
  CONSTRAINT fk_tp_flightRes
    FOREIGN KEY (flightReservationID)
    REFERENCES Reservation(reservationID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tp_hotelRes
    FOREIGN KEY (hotelReservationID)
    REFERENCES Reservation(reservationID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tp_rentalCarRes
    FOREIGN KEY (rentalCarReservationID)
    REFERENCES Reservation(reservationID)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_tp_agent
    FOREIGN KEY (agentID)
    REFERENCES TravelAgent(agentID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (23) PackageDiscount
CREATE TABLE PackageDiscount (
  packageID   VARCHAR(36) NOT NULL,
  discountID  VARCHAR(36) NOT NULL,
  PRIMARY KEY (packageID, discountID),
  CONSTRAINT fk_pd_package
    FOREIGN KEY (packageID)
    REFERENCES TravelPackage(packageID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_pd_discount
    FOREIGN KEY (discountID)
    REFERENCES Discount(discountID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (24) SupportTicket
CREATE TABLE SupportTicket (
  ticketID         VARCHAR(36) NOT NULL,
  userID           VARCHAR(36),
  travelPackageID  VARCHAR(36),
  issueDescription VARCHAR(255),
  status           VARCHAR(50),
  resolutionDate   DATE,
  PRIMARY KEY (ticketID),
  CONSTRAINT fk_st_user
    FOREIGN KEY (userID)
    REFERENCES Traveler(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_st_package
    FOREIGN KEY (travelPackageID)
    REFERENCES TravelPackage(packageID)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (25) LocationHotel
CREATE TABLE LocationHotel (
  locationID  VARCHAR(36) NOT NULL,
  hotelID     VARCHAR(36) NOT NULL,
  PRIMARY KEY (locationID, hotelID),
  CONSTRAINT fk_lh_loc
    FOREIGN KEY (locationID)
    REFERENCES Location(locationID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_lh_hotel
    FOREIGN KEY (hotelID)
    REFERENCES Hotel(hotelID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (26) LocationFlight
CREATE TABLE LocationFlight (
  locationID  VARCHAR(36) NOT NULL,
  flightID    VARCHAR(36) NOT NULL,
  PRIMARY KEY (locationID, flightID),
  CONSTRAINT fk_lf_loc
    FOREIGN KEY (locationID)
    REFERENCES Location(locationID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_lf_fl
    FOREIGN KEY (flightID)
    REFERENCES Flight(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- (27) LocationTravelPackage
CREATE TABLE LocationTravelPackage (
  locationID       VARCHAR(36) NOT NULL,
  travelPackageID  VARCHAR(36) NOT NULL,
  PRIMARY KEY (locationID, travelPackageID),
  CONSTRAINT fk_ltp_loc
    FOREIGN KEY (locationID)
    REFERENCES Location(locationID)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_ltp_pkg
    FOREIGN KEY (travelPackageID)
    REFERENCES TravelPackage(packageID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Insert Sample Data

-- Traveler
INSERT INTO Traveler (id, firstName, lastName, eMail, phoneNumber)
VALUES
 ('T100','Alice','Anderson','alice@example.com','123-456-7890'),
 ('T101','Bob','Brown','bob@example.com','555-555-1212');

-- Activity
INSERT INTO Activity (id, name, description)
VALUES
 ('A200','City Tour','Guided walking tour'),
 ('A201','Scuba Diving','Underwater diving experience');

-- Airline
INSERT INTO Airline (id, airlineName, country, IATACode, hubAirport, website)
VALUES
 ('AR300','FlyHigh Airlines','USA','FH','JFK','http://flyhigh.com'),
 ('AR301','SkyWings','Canada','SW','YYZ','http://skywings.ca');

-- Flight
INSERT INTO Flight (id, airline, departureCity)
VALUES
 ('F400','AR300','New York'),
 ('F401','AR301','Toronto');

-- Hotel
INSERT INTO Hotel (hotelID, hotelName, city, country, averageRating, numberOfRooms, amenities, contactNumber, email, website, checkInTime, checkOutTime, HotelChain)
VALUES
 ('H500','Grand Hotel','New York','USA',4.3,200,'Pool,Wi-Fi','212-999-8888','grandNY@example.com','http://grandny.com','2025-03-01 14:00:00','2025-03-02 11:00:00','GrandChain'),
 ('H501','Maple Inn','Toronto','Canada',4.0,150,'Wi-Fi,Breakfast','416-777-6666','mapleInn@example.com','http://mapleinn.ca','2025-03-01 15:00:00','2025-03-02 12:00:00','MapleGroup');

-- Room
INSERT INTO Room (roomID, hotelID, roomNumber, bedType, capacity, pricePerNight, availabilityStatus, viewType, amenities, floor, size)
VALUES
 ('R600','H500','101','Queen',2,120.00,'Available','City','TV,AC',1,25.0),
 ('R601','H501','202','King',2,150.00,'Available','City','TV,AC,Balcony',2,30.0);

-- Car
INSERT INTO Car (carID, carModel, carType, seatingCapacity, fuelType, transmission, licensePlate, color, year)
VALUES
 ('C700','Toyota Corolla','Sedan',5,'Gasoline','Automatic','ABC123','White',2021),
 ('C701','Honda Civic','Sedan',5,'Gasoline','Automatic','XYZ987','Black',2022);

-- RentalCarCompany
INSERT INTO RentalCarCompany (companyID, companyName, headquarters, contactNumber, email, website, fleetSize, averageRating, policies, loyaltyProgram)
VALUES
 ('RC800','EasyRent','New York','212-555-1234','info@easyrent.com','http://easyrent.com',100,4.2,'Standard terms','EasyClub'),
 ('RC801','MapleRent','Toronto','416-555-9876','contact@maplerent.ca','http://maplerent.ca',50,4.0,'Additional driver fees','MapleRewards');

-- RentalCarCompanyOperatingCountry
INSERT INTO RentalCarCompanyOperatingCountry (companyID, country)
VALUES
 ('RC800','USA'),
 ('RC800','Canada'),
 ('RC801','Canada');

-- RentalCarCompanyLocation
INSERT INTO RentalCarCompanyLocation (companyID, locationName)
VALUES
 ('RC800','JFK Airport'),
 ('RC800','Toronto Downtown'),
 ('RC801','Toronto Airport');

-- RentalCar
INSERT INTO RentalCar (rentalCarID, carID, companyID, rentalPricePerDay, mileageLimitPerDay, availabilityStatus, pickupLocation, insuranceIncluded)
VALUES
 ('RC900','C700','RC800',45.00,100.00,'Available','JFK Airport','YES'),
 ('RC901','C701','RC801',50.00,120.00,'Available','Toronto Airport','NO');

-- TravelInsurance
INSERT INTO TravelInsurance (
  insuranceID, travelerID, insuranceProviderID,
  policyName, coverageType, coverageAmount, premiumCost,
  duration, startDate, endDate,
  contactNumber, claimProcess, policyTerms, averageRating
)
VALUES
 ('TI1000','T100','PRV1','Basic Coverage','Health & Travel',50000.00,200.00,
  '7 days','2025-03-01','2025-03-08','1-800-INSURE','Online','Standard terms',4.5);

-- Reservation
INSERT INTO Reservation (reservationID, customerID, reservationName, reservationType)
VALUES
 ('RS1100','T100','Spring Break Flight','Flight'),
 ('RS1101','T101','Business Trip Hotel','Hotel');

-- Discount
INSERT INTO Discount (discountID, discountName, discountDescription, percentageOff)
VALUES
 ('DS1200','SpringSale','Spring special discount',10.00),
 ('DS1201','SummerPromo','Summer promotional discount',15.00);

-- Notification
INSERT INTO Notification (notificationID, travelerID, notificationTitle, notificationMessage)
VALUES
 ('NT1300','T100','Flight Delay','Your flight has been delayed by 2 hours'),
 ('NT1301','T101','Hotel Confirmation','Your hotel reservation is confirmed');

-- Payment
INSERT INTO Payment (paymentID, reservationID, method, date, status)
VALUES
 ('PM1400','RS1100','Credit Card','2025-02-15','Paid'),
 ('PM1401','RS1101','PayPal','2025-02-20','Pending');

-- Policy
INSERT INTO Policy (policyID, type, description, effectiveDate, expiryDate)
VALUES
 ('PL1500','Cancellation','Flight cancellation coverage','2025-01-01','2025-12-31'),
 ('PL1501','Refund','Hotel refundable policy','2025-01-01','2025-12-31');

-- Cancellation
INSERT INTO Cancellation (cancellationID, customerID, policyID, cancellationReason, penalties)
VALUES
 ('CN1600','T100','PL1500','Flight canceled due to weather','No penalty'),
 ('CN1601','T101','PL1500','Personal reason','Partial penalty');

-- RefundRequest
INSERT INTO RefundRequest (refundID, customerID, policyID, refundReason, penalties)
VALUES
 ('RR1700','T100','PL1501','Hotel dissatisfaction','10% fee'),
 ('RR1701','T101','PL1501','Service issue','No fee');

-- TravelAgent
INSERT INTO TravelAgent (agentID, agentName, agency)
VALUES
 ('TA1800','Charlie','GlobeTrot Agency'),
 ('TA1801','Diana','SkyTravel Co');

-- Location
INSERT INTO Location (locationID, locationName, city, region, country, airportCode)
VALUES
 ('L1900','NYC','New York','NY','USA','JFK'),
 ('L1901','Toronto','Toronto','ON','Canada','YYZ');

-- TravelerActivity
INSERT INTO TravelerActivity (travelerID, activityID, locationID, dateVisited, activityDescription)
VALUES
 ('T100','A200','L1900','2025-03-02','Enjoyed a city tour in NYC'),
 ('T101','A201','L1901','2025-03-10','Scuba diving in Toronto facility');

-- Review
INSERT INTO Review (reviewID, name, description, rating, author, reviewedEntityType, reviewedEntityID)
VALUES
 ('RV2000','Great Hotel','Loved the service',4.5,'Alice','Hotel','H500'),
 ('RV2001','Decent Airline','On-time flight',4.0,'Bob','Airline','AR300');

-- TravelPackage
INSERT INTO TravelPackage (packageID, packageName, flightReservationID, hotelReservationID, rentalCarReservationID, agentID)
VALUES
 ('TP2100','NYC Tour Package','RS1100',NULL,NULL,'TA1800'),
 ('TP2101','Toronto Adventure',NULL,'RS1101',NULL,'TA1801');

-- PackageDiscount
INSERT INTO PackageDiscount (packageID, discountID)
VALUES
 ('TP2100','DS1200'),
 ('TP2101','DS1201');

-- SupportTicket
INSERT INTO SupportTicket (ticketID, userID, travelPackageID, issueDescription, status, resolutionDate)
VALUES
 ('ST2200','T100','TP2100','Issue with flight delay','Open',NULL),
 ('ST2201','T101','TP2101','Hotel overcharge','Resolved','2025-02-25');

-- LocationHotel
INSERT INTO LocationHotel (locationID, hotelID)
VALUES
 ('L1900','H500'),
 ('L1901','H501');

-- LocationFlight
INSERT INTO LocationFlight (locationID, flightID)
VALUES
 ('L1900','F400'),
 ('L1901','F401');

-- LocationTravelPackage
INSERT INTO LocationTravelPackage (locationID, travelPackageID)
VALUES
 ('L1900','TP2100'),
 ('L1901','TP2101');

-- 4. Queries
--    7 Typical Scenarios + 5 Analytical

--
-- 4.1  Typical Scenarios
--

-- (1) Search for Hotels, Flights, or Activities
-- Example: Search hotels in 'New York' with rating >= 4.0
SELECT hotelID, hotelName, city, averageRating
FROM Hotel
WHERE city = 'New York'
  AND averageRating >= 4.0;

-- Example: Search flights departing from 'Toronto'
SELECT F.id AS FlightID, F.departureCity, A.airlineName
FROM Flight F
JOIN Airline A ON F.airline = A.id
WHERE F.departureCity = 'Toronto';

-- Example: Search activities in 'Toronto' (based on location L1901)
SELECT A.id AS ActivityID, A.name, A.description
FROM Activity A
JOIN TravelerActivity TA ON A.id = TA.activityID
JOIN Location L ON TA.locationID = L.locationID
WHERE L.city = 'Toronto';

-- (2) Book a Travel Service
-- Example: Alice (T100) books a new Hotel
INSERT INTO Reservation (reservationID, customerID, reservationName, reservationType)
VALUES ('RS1102','T100','New Hotel Booking','Hotel');

-- (3) Manage Bookings (view/update/cancel)
-- Example: Update reservation name
UPDATE Reservation
SET reservationName = 'Extended Hotel Booking'
WHERE reservationID = 'RS1102';

-- (4) Process Payment Method
-- Example: Insert payment for 'RS1101'
INSERT INTO Payment (paymentID, reservationID, method, date, status)
VALUES ('PM1402','RS1101','Credit Card','2025-03-01','Paid');

-- (5) Leave a Review
-- Example: Alice reviews Maple Inn (H501)
INSERT INTO Review (reviewID, name, description, rating, author, reviewedEntityType, reviewedEntityID)
VALUES ('RV2002','Good Stay','Comfortable rooms',4.2,'Alice','Hotel','H501');

-- (6) Receive Notifications
-- Retrieve notifications for traveler 'T100'
SELECT N.notificationID, N.notificationTitle, N.notificationMessage, T.firstName, T.lastName
FROM Notification N
JOIN Traveler T ON N.travelerID = T.id
WHERE T.id = 'T100';

-- (7) Contact a travel agent for Itineraries/Packages
-- List travel agents & associated packages
SELECT TA.agentName, TA.agency, TP.packageName
FROM TravelAgent TA
LEFT JOIN TravelPackage TP ON TA.agentID = TP.agentID
ORDER BY TA.agentName;

--
-- 4.2  Analytical Queries
--

-- (1) Most popular destinations based on number of bookings + positive reviews
-- (Simplified example counting hotel reservations by city)
SELECT H.city AS Destination,
       COUNT(R.reservationID) AS TotalHotelBookings,
       AVG(IFNULL(Rev.rating, 0)) AS AvgRating
FROM Hotel H
JOIN Room RM ON H.hotelID = RM.hotelID
JOIN Reservation R ON R.reservationName LIKE '%Hotel%'
LEFT JOIN Review Rev
       ON Rev.reviewedEntityType = 'Hotel'
      AND Rev.reviewedEntityID = H.hotelID
GROUP BY H.city
ORDER BY TotalHotelBookings DESC, AvgRating DESC;

-- (2) Rate of cancellations/refunds over time + where these events occur
-- Example: cancellation count per city (join to traveler -> reservations -> hotel -> location)
SELECT L.city, COUNT(C.cancellationID) AS TotalCancellations
FROM Cancellation C
LEFT JOIN Traveler T ON C.customerID = T.id
LEFT JOIN Reservation R ON R.customerID = T.id
LEFT JOIN Hotel H ON R.reservationName LIKE '%Hotel%' AND H.hotelID = 'H500'
LEFT JOIN LocationHotel LH ON LH.hotelID = H.hotelID
LEFT JOIN Location L ON LH.locationID = L.locationID
GROUP BY L.city;

-- (3) Identify months/days/times with highest activity
-- Example: group by month of hotel checkInTime
SELECT MONTH(checkInTime) AS CheckInMonth,
       COUNT(*) AS HotelCheckIns
FROM Hotel
WHERE checkInTime IS NOT NULL
GROUP BY MONTH(checkInTime)
ORDER BY HotelCheckIns DESC;

-- (4) Calculate customer spending patterns (Paid bookings)
SELECT T.id AS TravelerID,
       T.firstName,
       T.lastName,
       SUM(CASE WHEN P.status='Paid' THEN 1 ELSE 0 END) AS TotalPaidBookings
FROM Traveler T
LEFT JOIN Reservation R ON T.id = R.customerID
LEFT JOIN Payment P ON R.reservationID = P.reservationID
GROUP BY T.id, T.firstName, T.lastName
ORDER BY TotalPaidBookings DESC;

-- (5) Discount impact on sales
-- Compare discounted vs. non-discounted packages
SELECT 
   CASE WHEN PD.packageID IS NOT NULL THEN 'Discounted' ELSE 'Non-Discounted' END AS DiscountStatus,
   COUNT(DISTINCT R.reservationID) AS TotalReservations
FROM TravelPackage TP
LEFT JOIN PackageDiscount PD ON TP.packageID = PD.packageID
LEFT JOIN Reservation R 
  ON (TP.flightReservationID = R.reservationID 
   OR TP.hotelReservationID = R.reservationID
   OR TP.rentalCarReservationID = R.reservationID)
GROUP BY DiscountStatus;