import {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

//.env
// import Config from 'react-native-config';
// OpenWeather API key
// const APIKEY = Config.WEATHER_API_KEY;
// console.log('Config', Config);
// console.log('WEATHER_API_KEY', Config.WEATHER_API_KEY);
const APIKEY = '4e1054401a172734d3dc64286264e14f';

function WeatherCard({cityName, lat, lon}) {
  // Weather data (weather, highest temperature, lowest temperature)
  const [weather, setWeather] = useState({
    id: 0,
    highestTemp: 0,
    lowestTemp: 0,
  });

  const [loading, setLoading] = useState(false);

  // Get weather description from weather ID
  const getWeatherDescription = id => {
    let weatherDescription = '';

    if (id >= 200 && id < 300) {
      weatherDescription = 'Thunderstorm';
    } else if (id >= 300 && id < 400) {
      weatherDescription = 'Drizzle';
    } else if (id >= 500 && id < 600) {
      weatherDescription = 'Rain';
    } else if (id >= 600 && id < 700) {
      weatherDescription = 'Snow';
    } else if (id >= 700 && id < 800) {
      weatherDescription = 'Atmosphere';
    } else if (id === 800) {
      weatherDescription = 'Clear';
    } else if (id > 800) {
      weatherDescription = 'Clouds';
    } else {
      weatherDescription = 'Unknown';
    }

    return weatherDescription;
  };

  // Get weather data from OpenWeather API
  const getWeatherFromAPI = async (lat, lon) => {
    console.log('APIKEY', APIKEY);

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}`,
      );
      const jsonWeather = await response.json();
      // console.log(jsonWeather);
      const weather = {
        id: getWeatherDescription(jsonWeather.weather[0].id),
        highestTemp: parseInt(jsonWeather.main.temp_max - 273.15),
        lowestTemp: parseInt(jsonWeather.main.temp_min - 273.15),
      };
      // console.log('Weather:', weather);
      setWeather(weather);
      return weather;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('cityName', cityName);
    console.log('position', lat, lon);
    getWeatherFromAPI(lat, lon);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{cityName}</Text>
      {/* <Text>Lat: {lat.toString()}</Text>
      <Text>Lon: {lon.toString()}</Text> */}
      <Text style={styles.customText}>Main Wheather: {weather.id}</Text>
      <Text style={styles.customText}>Highest: {weather.highestTemp}</Text>
      <Text style={styles.customText}>Lowest: {weather.lowestTemp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  titleText: {
    color: 'darkblue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  customText: {
    fontSize: 20,
  },
});

export default WeatherCard;
