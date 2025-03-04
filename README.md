# Travel Booking Project

This project is a full-stack travel booking application that allows users to view hotels, book travel services, and manage traveler information. The project includes a comprehensive SQL database, a Node.js backend, and a user interface (UI) built with HTML, CSS, and JavaScript.

## Project Structure

- **lname_fname_Queries.sql**: Contains all SQL queries for database creation, table definitions, sample data insertion, and example queries.
- **index.html**: The main HTML file for the UI.
- **styles.css**: The CSS file for styling the UI.
- **script.js**: The JavaScript file that connects the UI to the backend API and handles data fetching and DOM manipulation.
- **server.js**: The Node.js/Express backend server that connects to the MySQL database and provides API endpoints.
- **.env**: Environment variables used for database connection and server configuration.
- **package.json** and **package-lock.json**: Manage project dependencies.

## Installation and Running the Project

### Prerequisites
- **Node.js** and **npm** installed on your machine.
- **MySQL** installed and running.
- A MySQL database set up using the provided SQL queries.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd travel-backend
2. **Set Up the Database**
    Open your MySQL client.
    Run the SQL queries in lname_fname_Queries.sql to create the database, tables, and insert sample data.
    Ensure the database name and credentials match those in your .env file.
3. **Configure Environment Variables**
    Create a .env file in the project root (if not already present) with the following content:
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=password
        DB_NAME=db
        PORT=5001
    Adjust the values as needed for your local environment.
4. **Install Dependencies**
    npm install
5. **Run the Backend Server**
    npm start
    The server will start on port 5001 and connect to your MySQL database.
6. **Open the UI**
    Open index.html in your web browser.
    The UI will fetch data from the backend and display hotels and travelers.
