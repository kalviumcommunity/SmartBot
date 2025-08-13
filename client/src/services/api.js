// client/src/services/api.js


export const sendMessageToBot = async (history, tuningStyle) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // --- UPDATED: Send the entire history array ---
      body: JSON.stringify({ history, style: tuningStyle }),
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