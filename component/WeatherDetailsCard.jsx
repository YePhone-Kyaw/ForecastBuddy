import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function WeatherDetailsCard({ weather, description, temp, feelsLike, minTemp, maxTemp, humidity, windSpeed }) {
    return (
        <View style={styles.card}>
          <Text style={styles.weather}>{weather}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.temp}>{Math.round(temp)}°C</Text>
          <Text style={styles.feelsLike}>Feels like: {Math.round(feelsLike)}°C</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>Min: {Math.round(minTemp)}°C</Text>
            <Text style={styles.detailText}>Max: {Math.round(maxTemp)}°C</Text>
            <Text style={styles.detailText}>Humidity: {humidity}%</Text>
            <Text style={styles.detailText}>Wind Speed: {windSpeed} m/s</Text>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
    width: '90%', 
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, 
    shadowRadius: 4.65,
    elevation: 6,
  },
  weather: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 4, 
  },
  description: {
    fontSize: 18,
    color: '#555', 
    marginBottom: 6, 
  },
  temp: {
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8, 
  },
  details: {
    marginTop: 10,
    paddingLeft: 10, 
  },
  detailText: {
    fontSize: 16, 
    color: '#666', 
    marginVertical: 4, 
  },
  feelsLike: {
    fontSize: 18,
    color: '#333', 
    marginTop: 10, 
    marginBottom: 10, 
  },
});



export default WeatherDetailsCard;