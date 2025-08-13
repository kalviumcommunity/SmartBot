// client/src/services/api.js

// Accept tuningStyle as an argument
export const sendMessageToBot = async (message, tuningStyle) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send both message and style
      body: JSON.stringify({ message, style: tuningStyle }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error sending message to bot:', error);
    return { sender: 'bot', text: 'Sorry, I was unable to connect to the server.' };
  }
};