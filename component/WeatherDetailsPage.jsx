import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import WeatherDetailsCard from './WeatherDetailsCard'; // Adjust the import path as needed
import { WEATHER_API_KEY } from '../env';
import LinearGradient from 'react-native-linear-gradient';

const API_KEY = WEATHER_API_KEY;

function WeatherDetailsPage() {
  const [localCity, setLocalCity] = useState('');
  const [localLatitude, setLocalLatitude] = useState(0);
  const [localLongitude, setLocalLongitude] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setLocalLatitude(latitude);
        setLocalLongitude(longitude);
        const currentCity = await getCityNameByPosition(latitude, longitude);
        setLocalCity(currentCity);
        fetchWeatherDetails(latitude, longitude);
      },
      error => {
        console.error('Geolocation error:', error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const getCityNameByPosition = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
      );
      const json = await response.json();
      return json[0].name;
    } catch (error) {
      console.error(error);
      return 'Unknown Location';
    }
  };

  const fetchWeatherDetails = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      const json = await response.json();
      setWeatherData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <LinearGradient
      colors={['#83ADFF', '#FFFDC9', '#83ADFF']}
      style={styles.container}>
      <Text style={styles.title}>Forecast Details</Text>

        <View>
      <Text style={styles.location}>My Location</Text>

        <Text style={styles.location}>{localCity}</Text>

        </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : weatherData ? (
        <WeatherDetailsCard
          weather={weatherData.weather[0].main}
          description={weatherData.weather[0].description}
          temp={weatherData.main.temp}
          feelsLike={weatherData.main.feels_like}
          minTemp={weatherData.main.temp_min}
          maxTemp={weatherData.main.temp_max}
          humidity={weatherData.main.humidity}
          windSpeed={weatherData.wind.speed}
          
        />
      ) : (
        <Text>Failed to load weather data</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: '#183B80',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  location: {
    fontSize: 20,
    color: '#183B80',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default WeatherDetailsPage;