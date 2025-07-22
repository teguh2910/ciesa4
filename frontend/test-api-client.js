// Simple test to verify API client functionality
// This should be run in the browser console

console.log('Testing API client...');

// Test if the API client is properly initialized
try {
    // Import the API client (this would work in the browser context)
    console.log('API client base URL:', window.location.origin);
    
    // Test health check
    fetch('http://localhost:5001/api/health')
        .then(response => response.json())
        .then(data => {
            console.log('Health check successful:', data);
        })
        .catch(error => {
            console.error('Health check failed:', error);
        });
        
} catch (error) {
    console.error('API client test failed:', error);
}
