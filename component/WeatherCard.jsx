import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

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
        id: jsonWeather.weather[0].id,
        highestTemp: jsonWeather.main.temp_max,
        lowestTemp: jsonWeather.main.temp_min,
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
    // getWeatherFromAPI(latitude, longitude);
  }, []);

  return (
    <View>
      <Text>WeatherCard</Text>
      <Text>City: {cityName}</Text>
      <Text>Lat: {lat.toString()}</Text>
      <Text>Lon: {lon.toString()}</Text>
    </View>
  );
}

export default WeatherCard;
