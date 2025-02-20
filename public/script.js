// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const uptimeDisplay = document.getElementById('uptimeDisplay');
    if (!uptimeDisplay) {
        console.error('Element with ID "uptimeDisplay" not found!');
        return;
    }

    const eventSource = new EventSource('/api/uptimeEvents'); // Connect to SSE endpoint

    eventSource.onopen = () => {
        console.log('SSE connection opened');
    };

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data); // Parse JSON data from SSE message
            if (data.uptime !== undefined) {
                uptimeDisplay.textContent = `Server Uptime: ${data.uptime}`; // Update UI
            } else {
                console.log('Received message:', event.data); // Log other messages
                if (event.data === "Uptime stream started.") {
                    uptimeDisplay.textContent = "Uptime stream started...";
                }
            }
        } catch (e) {
            console.error('Error parsing SSE data:', e);
            console.log('Raw SSE data:', event.data); // Log raw data for debugging
        }
    };

    eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close(); // Close connection on error
    };
});