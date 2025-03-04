/* script.js - Connects the UI to the backend API and handles data fetching

  This script waits for the DOM to load, then:
  1. Fetches hotels, travelers, flights, activities, reviews, reservations,
     rental cars, and travel agents from the backend API.
  2. Updates the corresponding containers in the UI with the retrieved data.
*/

document.addEventListener("DOMContentLoaded", function () {
  // Fetch Hotels
  fetch("http://localhost:5001/api/hotels")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("hotels-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No hotels found in New York with rating >= 4.0.</p>";
        return;
      }
      data.forEach(hotel => {
        const hotelDiv = document.createElement("div");
        hotelDiv.className = "hotel";
        hotelDiv.innerHTML = `
          <h3>${hotel.hotelName}</h3>
          <p>City: ${hotel.city}</p>
          <p>Rating: ${hotel.averageRating}</p>
        `;
        container.appendChild(hotelDiv);
      });
    })
    .catch(error => console.error("Error fetching hotels:", error));

  // Fetch Travelers
  fetch("http://localhost:5001/api/travelers")
    .then(response => response.json())
    .then(data => {
      const travelerList = document.getElementById("traveler-list");
      travelerList.innerHTML = "";
      data.forEach(traveler => {
        const listItem = document.createElement("li");
        listItem.textContent = `${traveler.firstName} ${traveler.lastName} - ${traveler.eMail}`;
        travelerList.appendChild(listItem);
      });
    })
    .catch(error => console.error("Error fetching travelers:", error));

  // Fetch Flights
  fetch("http://localhost:5001/api/flights")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("flights-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No flights found.</p>";
        return;
      }
      data.forEach(flight => {
        const flightDiv = document.createElement("div");
        flightDiv.className = "flight";
        flightDiv.innerHTML = `
          <h3>Flight ${flight.id}</h3>
          <p>Airline: ${flight.airlineName || flight.airline}</p>
          <p>Departure City: ${flight.departureCity}</p>
        `;
        container.appendChild(flightDiv);
      });
    })
    .catch(error => console.error("Error fetching flights:", error));

  // Fetch Activities
  fetch("http://localhost:5001/api/activities")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("activities-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No activities found.</p>";
        return;
      }
      data.forEach(activity => {
        const actDiv = document.createElement("div");
        actDiv.className = "activity";
        actDiv.innerHTML = `
          <h3>${activity.name}</h3>
          <p>Description: ${activity.description}</p>
        `;
        container.appendChild(actDiv);
      });
    })
    .catch(error => console.error("Error fetching activities:", error));

  // Fetch Reviews
  fetch("http://localhost:5001/api/reviews")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("reviews-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No reviews found.</p>";
        return;
      }
      data.forEach(review => {
        const reviewDiv = document.createElement("div");
        reviewDiv.className = "review";
        reviewDiv.innerHTML = `
          <h3>${review.name}</h3>
          <p>Rating: ${review.rating}</p>
          <p>${review.description}</p>
          <p>Author: ${review.author}</p>
        `;
        container.appendChild(reviewDiv);
      });
    })
    .catch(error => console.error("Error fetching reviews:", error));

  // Fetch Reservations
  fetch("http://localhost:5001/api/reservations")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("reservations-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No reservations found.</p>";
        return;
      }
      data.forEach(reservation => {
        const resDiv = document.createElement("div");
        resDiv.className = "reservation";
        resDiv.innerHTML = `
          <h3>Reservation: ${reservation.reservationName}</h3>
          <p>Type: ${reservation.reservationType}</p>
          <p>Customer ID: ${reservation.customerID}</p>
        `;
        container.appendChild(resDiv);
      });
    })
    .catch(error => console.error("Error fetching reservations:", error));

  // Fetch Rental Cars
  fetch("http://localhost:5001/api/rentalcars")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("rental-cars-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No rental cars found.</p>";
        return;
      }
      data.forEach(car => {
        const carDiv = document.createElement("div");
        carDiv.className = "rental-car";
        carDiv.innerHTML = `
          <h3>${car.carModel}</h3>
          <p>Type: ${car.carType}</p>
          <p>Price Per Day: ${car.rentalPricePerDay}</p>
        `;
        container.appendChild(carDiv);
      });
    })
    .catch(error => console.error("Error fetching rental cars:", error));

  // Fetch Travel Agents
  fetch("http://localhost:5001/api/travelagents")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("travel-agents-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No travel agents found.</p>";
        return;
      }
      data.forEach(agent => {
        const agentDiv = document.createElement("div");
        agentDiv.className = "travel-agent";
        agentDiv.innerHTML = `
          <h3>${agent.agentName}</h3>
          <p>Agency: ${agent.agency}</p>
        `;
        container.appendChild(agentDiv);
      });
    })
    .catch(error => console.error("Error fetching travel agents:", error));
});
