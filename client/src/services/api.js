export const sendMessageToBot = async (message) => {
    try {
      // The '/api/chat' path will be proxied by Vite to your backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
  
      if (!response.ok) {
        // If the server responds with an error, throw it to the catch block
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error sending message to bot:', error);
      // Return a user-friendly error message
      return { sender: 'bot', text: 'Sorry, I was unable to connect to the server.' };
    }
  };