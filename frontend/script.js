document.addEventListener('DOMContentLoaded', function() {
    // Fetch hotels from the backend API
    fetch('http://localhost:3000/api/hotels')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('hotels-container');
        if (data.length === 0) {
          container.innerHTML = '<p>No hotels found in New York with rating >= 4.0.</p>';
          return;
        }
        data.forEach(hotel => {
          const hotelDiv = document.createElement('div');
          hotelDiv.className = 'hotel';
          hotelDiv.innerHTML = `
            <h2>${hotel.hotelName}</h2>
            <p>City: ${hotel.city}</p>
            <p>Rating: ${hotel.averageRating}</p>
          `;
          container.appendChild(hotelDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  });
  