// server/tools.js
const axios = require('axios');

// The real function that calls the WeatherAPI
const getWeather = async (city) => {
  try {
    console.log(`TOOL EXECUTED: Calling WeatherAPI for city: ${city}`);
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
    const response = await axios.get(url);
    const weatherData = response.data;

    // We'll return a simple string with the key information
    const result = `The temperature in ${weatherData.location.name} is ${weatherData.current.temp_c}°C and the condition is ${weatherData.current.condition.text}.`;
    return result;

  } catch (error) {
    console.error("Error fetching weather data:", error.response ? error.response.data : error.message);
    return "Sorry, I was unable to retrieve the weather information for that location.";
  }
};


const tools = [
  {
    "name": "getWeather",
    "description": "Get the current weather in a given city name.",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "The city or region name, e.g., San Francisco, London, or Tokyo.",
        },
      },
      "required": ["city"],
    },
  }
];

module.exports = {
  getWeather,
  tools,
};