/* script.js - Connects the UI to the backend API and handles data fetching */

/*
  This script waits for the DOM to load, then:
  1. Fetches hotel data from the backend API endpoint (http://localhost:5001/api/hotels).
  2. Updates the hotels container in the UI with hotel cards.
  3. Fetches traveler data from the backend API endpoint (http://localhost:5001/api/travelers).
  4. Updates the traveler list with the retrieved data.
*/

document.addEventListener("DOMContentLoaded", function () {
  // Fetch hotels from the backend API
  fetch("http://localhost:5001/api/hotels")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("hotels-container");
      if (data.length === 0) {
        container.innerHTML = "<p>No hotels found in New York with rating >= 4.0.</p>";
        return;
      }
      // Create a card for each hotel and append to the container
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
    .catch(error => {
      console.error("Error fetching hotels:", error);
    });

  // Fetch travelers from the backend API
  fetch("http://localhost:5001/api/travelers")
    .then(response => response.json())
    .then(data => {
      const travelerList = document.getElementById("traveler-list");
      // Clear any existing list items
      travelerList.innerHTML = "";
      // Create a list item for each traveler
      data.forEach(traveler => {
        const listItem = document.createElement("li");
        listItem.textContent = `${traveler.firstName} ${traveler.lastName} - ${traveler.eMail}`;
        travelerList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error("Error fetching travelers:", error);
    });
});
