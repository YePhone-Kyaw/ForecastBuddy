import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons/faBars';
import {StackNavigationProp} from '@react-navigation/stack';
import Test from './component/Test';
import WeatherForecastPage from './component/WeatherForecastPage';

// Initialize Stack Navigator
const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Test />
      <Button
        title="Go to WeatherForecastPage"
        onPress={() => navigation.navigate('WeatherForecastPage')}
      />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={({navigation}) => ({
            title: 'My home',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                  }
                }}
                style={{marginLeft: 15}}>
                <FontAwesomeIcon icon={faBars} size={24} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="WeatherForecastPage"
          component={WeatherForecastPage}
          options={{title: 'Weather Forecast'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
