# Weather Monitoring Application

![image](https://github.com/user-attachments/assets/21a960b1-d6c0-4c16-9d72-5f1b4e77f7c2)


**Live Demo:** [Live View](https://weather-monitoring-frontend.onrender.com/)  
**GitHub Links:**  
- **Frontend:** [GitHub Repository for Frontend](https://github.com/saurabhdohaiya/weather-monitoring-frontend)  
- **Backend:** [GitHub Repository for Backend](https://github.com/saurabhdohaiya/weather-monitoring-backend)  

## Overview

The Weather Monitoring Application provides users with real-time weather updates, past weather data, and daily summaries. It features an intuitive user interface and responsive design, allowing users to interactively visualize weather information.

## Features

1. **Current Weather Data**
   - Users can view real-time weather information for a specified city, including:
     - Temperature
     - Feels-like temperature
     - Weather conditions (e.g., sunny, cloudy)

2. **Integration with OpenWeatherMap**
   - The application integrates with the OpenWeatherMap API to fetch accurate and up-to-date weather data, ensuring that users receive reliable information based on global weather conditions.

3. **Past 8 Hours Data**
   - The application visualizes average temperature and feels-like temperature for the past 8 hours, enabling users to track recent weather changes.

4. **Daily Summaries**
   - Daily summaries are saved and include:
     - Date
     - Average temperature
     - Minimum temperature
     - Maximum temperature
     - Dominant weather condition
   - This feature allows users to easily review historical weather data.

5. **Temperature Conversion Utility**
   - Users can convert temperatures from Celsius to Fahrenheit, enhancing usability for different regions and user preferences.

6. **Alert Module**
   - Users can set alerts based on specific weather conditions and temperatures, ensuring they are notified of significant weather changes.

7. **Data Storage**
   - A dedicated MongoDB database is utilized for storing weather data and daily summaries, ensuring that all relevant information is aggregated and rolled up daily for accurate historical records.

8. **Real-Time Updates**
   - The application updates weather data every 5 minutes, ensuring users have access to the latest information.

9. **Responsive Design and Interactive UI**
   - The application is designed to be responsive, ensuring a seamless experience on various devices. The user interface is interactive, allowing for smooth navigation and data visualization.

![image](https://github.com/user-attachments/assets/d6f31871-c4ab-4208-a451-7fff2e9304ca)


10. **Visualization using ChartJS**
    - ChartJS is used for visualizing weather data, providing graphical representations of temperature trends and summaries.

11. **Error Handling**
    - The application includes robust error handling, displaying clear error messages to users in case of issues such as network errors or invalid inputs.

12. **Loading State with Shimmer Effect**
    - While data is being fetched, a shimmer effect is displayed to indicate loading, enhancing the user experience by providing visual feedback.

## Routes

- **GET /api/weather/current:** Fetch current weather data for a specified city.
- **GET /api/weather/history?past_hours_count=8:** Retrieve past 8 hours of weather data(if present in DB).
- **POST /api/weather/history?past_days_count=8:** Retrieve past 8 days of weather data(if Present if DB).

## Conclusion

This Weather Monitoring Application is designed to provide users with comprehensive and user-friendly access to weather data, enhancing their ability to plan and respond to changing weather conditions effectively.
