import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import {WEATHER_API_KEY} from '../env';

const API_KEY = WEATHER_API_KEY;

function WeatherCard({cityName, lat, lon}) {
  const [weather, setWeather] = useState({
    id: 0,
    description: '',
    currentTemp: 0,
    highestTemp: 0,
    lowestTemp: 0,
    humidity: 0,
    icon: '',
  });

  const [loading, setLoading] = useState(true);

  const getWeatherFromAPI = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
      );
      const jsonWeather = await response.json();

      if (
        jsonWeather.weather &&
        jsonWeather.weather.length > 0 &&
        jsonWeather.main
      ) {
        setWeather({
          id: jsonWeather.weather[0].id,
          description: jsonWeather.weather[0].description,
          currentTemp: jsonWeather.main.temp,
          highestTemp: jsonWeather.main.temp_max,
          lowestTemp: jsonWeather.main.temp_min,
          humidity: jsonWeather.main.humidity,
          icon: jsonWeather.weather[0].icon,
        });
      } else {
        console.log('Unexpected response structure', jsonWeather);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherFromAPI(lat, lon);
  }, [lat, lon]);

  if (loading) {
    return <Text>Loading weather data...</Text>;
  }

  return (
    <ScrollView style={styles.card}>
      <View style={styles.manageCard}>
        <View>
          <View style={styles.textSplit}>
            <Text style={styles.cityName}>{cityName}</Text>
            <Text style={styles.details}>{weather.description}</Text>
          </View>

          <View style={styles.details}>
            <Text>Max: {Math.round(weather.highestTemp)}°C</Text>
            <Text>Min: {Math.round(weather.lowestTemp)}°C</Text>
            <Text>Humidity: {weather.humidity}%</Text>
          </View>
        </View>
        <View style={styles.weatherInfo}>
          <Text style={styles.temperature}>
            {Math.round(weather.currentTemp)}°C
          </Text>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#006FD5',
    borderRadius: 20,
    padding: 5,
    marginVertical: 3,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: 'white',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white',
  },
  weatherInfo: {
    flexDirection: 'col',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  weatherIcon: {
    width: 70,
    height: 70,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 16,
  },
  details: {
    marginHorizontal: 10,
    marginVertical: 3,
    flexDirection: 'col',
    justifyContent: 'space-between',
    color: 'white'
  },
  manageCard: {
    flexDirection: 'row',
    marginHorizontal: 3,
    justifyContent: 'space-between',
  },
  textSplit: {
    marginBottom: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default WeatherCard;
