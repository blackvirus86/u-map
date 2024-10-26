const map = L.map('map').setView([51.505, -0.09], 13); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom 3D pin icon (replace with your icon URL)
const pinIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Function to toggle hand tool
function toggleHandTool(enable) {
    if (enable) {
        map.dragging.enable();
        map.off('click', onMapClick); 
    } else {
        map.dragging.disable();
        map.on('click', onMapClick);
    }
}

// Initially, disable dragging (hand tool)
toggleHandTool(false);

// Spacebar event listener
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        toggleHandTool(true);
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        toggleHandTool(false);
    }
});

function onMapClick(e) {
    const latlng = e.latlng;

    // Create the marker
    const marker = L.marker(latlng, { icon: pinIcon }).addTo(map);

    // Create and open the popup
    const popup = L.popup()
        .setLatLng(latlng)
        .setContent('<form id="pin-form">' +
                     '<label for="remarks">Remarks:</label><br>' +
                     '<input type="text" id="remarks" name="remarks"><br><br>' +
                     '<button type="submit">Save</button>' +
                     '</form>')
        .openOn(map);

    // Handle form submission
    const pinForm = document.getElementById('pin-form');
    pinForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const remarks = document.getElementById('remarks').value;
        savePin(marker, remarks); 

        // Close the popup after saving
        map.closePopup(popup); 
    });
}

function savePin(marker, remarks) {
    // Show remarks on hover
    marker.bindTooltip(remarks, {
        permanent: false,
        direction: 'top',
        opacity: 0.8,
        className: 'remark-tooltip'
    });
}