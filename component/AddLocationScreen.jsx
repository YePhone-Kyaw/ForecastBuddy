import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherCard from './WeatherCard';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {WEATHER_API_KEY} from '../env';
import LinearGradient from 'react-native-linear-gradient';

const API_KEY = WEATHER_API_KEY;

function AddLocationScreen({navigation}) {
  const [inputLocation, setInputLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStoredLocations();
  }, []);

  useEffect(() => {
    if (inputLocation.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [inputLocation]);

  const fetchStoredLocations = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      const storedLocations = result.map(([key, value]) => ({
        name: key,
        ...JSON.parse(value),
      }));
      setLocationList(storedLocations);
    } catch (error) {
      console.error('Error fetching stored locations:', error);
    }
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputLocation}&limit=5&appid=${API_KEY}`,
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async location => {
    const newLocation = {
      name: location.name,
      lat: location.lat,
      lon: location.lon,
    };

    await storeLocationData(newLocation.name, {
      lat: newLocation.lat,
      lon: newLocation.lon,
    });

    setLocationList(prevList => [...prevList, newLocation]);
    setInputLocation('');
    setSuggestions([]);
  };

  const storeLocationData = async (cityName, position) => {
    try {
      const jsonValue = JSON.stringify(position);
      await AsyncStorage.setItem(cityName, jsonValue);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLocation = async locationName => {
    try {
      await AsyncStorage.removeItem(locationName);
      setLocationList(prevList =>
        prevList.filter(item => item.name !== locationName),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const renderSuggestion = ({item}) => (
    <TouchableOpacity
      onPress={() => handleAddLocation(item)}
      style={styles.suggestionItem}>
      <Text style={styles.suggestionText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );

  const renderRightActions = (progress, dragX, item) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteLocation(item.name)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderLocation = ({item}) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
      rightThreshold={40}>
      <WeatherCard cityName={item.name} lat={item.lat} lon={item.lon} />
    </Swipeable>
  );

  return (
    <LinearGradient
      colors={['#83ADFF', '#FFFDC9', '#83ADFF']}
      style={styles.container}>
      <GestureHandlerRootView>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          placeholderTextColor="#888888"
          value={inputLocation}
          onChangeText={setInputLocation}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={renderSuggestion}
            style={styles.suggestionList}
          />
        )}
        <FlatList
          data={locationList}
          keyExtractor={item => item.name}
          renderItem={renderLocation}
        />
      </GestureHandlerRootView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  suggestionList: {
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  suggestionText: {
    color: 'gray',
  },
  deleteButton: {
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '90%',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddLocationScreen;
