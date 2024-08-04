import {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from 'react-native';

// GPS
import Geolocation from '@react-native-community/geolocation';

Geolocation.getCurrentPosition(info => console.log('current position:', info));

// Local storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherCard from './WeatherCard';

const APIKEY = '4e1054401a172734d3dc64286264e14f';

// Styles for separate items
const Separator = () => <View style={{marginVertical: 8}} />;

// --- Weather Forecast Page  ---------------------------------------------------
function WeatherForecastPage({navigation}) {
  // Location List in AsyncStorage (cityName, lat, lon)
  const [locationList, setLocationList] = useState([]);

  //Get local location
  const [localLatitude, setLocalLatitude] = useState(0);
  const [localLongitude, setLocalLongitude] = useState(0);
  const [localCity, setLocalCity] = useState('');

  // Input location is city name
  const [inputLocation, setInputLocation] = useState('');

  //Loading
  const [loading, setLoading] = useState(false);

  // Get current location by GPS
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        try {
          console.log('getCurrentPosition success', pos);
          const {latitude, longitude} = pos.coords;
          setLocalLatitude(latitude);
          setLocalLongitude(longitude);

          // Get city name based on position
          const currentCity = await getCityNameByPosition(latitude, longitude);
          setLocalCity(currentCity);
        } catch (error) {
          console.error('Error handling position:', error);
          Alert.alert(
            'Error',
            'An error occurred while processing the location.',
          );
        }
      },
      error => {
        console.error('Geolocation error:', error);
        Alert.alert('GetCurrentPosition Error', JSON.stringify(error));
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  //Get city name by latitute and longitude
  const getCityNameByPosition = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${APIKEY}`,
      );
      const json = await response.json();
      console.log('getCityName', json[0].name);
      return json[0].name;
    } catch (error) {
      console.error(error);
    }
  };

  // Get stored locations
  const fetchStoredData = async () => {
    try {
      const cities = await getCityNames();
      const locationPromises = cities.map(async city => {
        const position = await getLocationData(city);
        return [city, position.lat, position.lon];
      });

      const locations = await Promise.all(locationPromises);
      setLocationList(locations);
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search the location
  const searchLocationHandler = async () => {
    if (inputLocation.trim() === '') {
      Alert.alert('Input Error', 'Please enter a location.');
      return;
    }

    try {
      // Geocoding API to get latitude and longitude from location name (replace with your preferred geocoding service)
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputLocation.trim()}&appid=${APIKEY}`,
      );
      const json = await response.json();
      console.log('json', json);
      console.log('lat,lon: ', json[0].lat, json[0].lon);
      console.log('name: ', json[0].name);

      if (json.cod === '404') {
        Alert.alert('Location Not Found', 'Please enter a valid location.');
        return;
      }

      // Store location data to AsyncStorage
      storeLocationData(json[0].name, {
        lat: json[0].lat,
        lon: json[0].lon,
      });

      // Update location list
      fetchStoredData();
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Search Error',
        'An error occurred while searching for the location.',
      );
    }
  };

  // Get city names in AsyncStorage (city names = keys)
  const getCityNames = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      // Filter keys used for other purpose
      const filteredKeys = keys.filter(
        key => key !== 'location' && key !== 'settings',
      );
      return filteredKeys;
    } catch (error) {
      console.error(error);
    }
  };

  // Read location data from AsyncStorage
  const getLocationData = async cityName => {
    try {
      const jsonValue = await AsyncStorage.getItem(cityName);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(error);
    }
    console.log('Done: getLocationData');
  };

  // Store location data to AsyncStorage
  const storeLocationData = async (cityName, position) => {
    try {
      const jsonValue = JSON.stringify(position);
      await AsyncStorage.setItem(cityName, jsonValue);
    } catch (error) {
      console.error(error);
    }
    console.log('Done: storeLocationData');
  };

  // Remove location data from AsyncStorage
  const removeLocationData = async cityName => {
    try {
    } catch (error) {
      console.error(error);
    }
    console.log('Done: removeLocationData');
  };

  useEffect(() => {
    // Get current location
    getCurrentPosition();

    fetchStoredData();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TextInput
        style={styles.textBox}
        placeholder="Enter location"
        value={inputLocation}
        onChangeText={setInputLocation}
      />
      <Button title="Search Location" onPress={searchLocationHandler} />
      <Separator />

      <WeatherCard
        cityName={localCity}
        lat={localLatitude}
        lon={localLongitude}
      />
      <Separator />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        locationList.map((location, index) => (
          <WeatherCard
            key={index}
            cityName={location[0]}
            lat={location[1]}
            lon={location[2]}
          />
        ))
      )}
      <Separator />

      <Button
        title="Go to Home Page"
        onPress={() => navigation.navigate('HomeScreen')}
      />
      <Separator />
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
  textBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default WeatherForecastPage;
