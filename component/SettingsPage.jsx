import React, {useMemo, useState} from 'react';
import {StyleSheet, View, Button, Text, ImageBackground} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import backgroundImage from '../images/forecastBuddyBG.png';

// Notifee
import notifee, {TriggerType, RepeatFrequency} from '@notifee/react-native';

function SettingsPage() {
  const [date, setDate] = useState(new Date());
  const [selectedId, setSelectedId] = useState('1');

  const radioButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'Daily',
        value: 'DAILY',
      },
      {
        id: '2',
        label: 'Weekly',
        value: 'WEEKLY',
      },
    ],
    [],
  );

  const getSelectedValue = () => {
    const selectedButton = radioButtons.find(
      button => button.id === selectedId,
    );
    return selectedButton ? selectedButton.value : null;
  };

  const onClickSetNotification = () => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const selectedFrequency = getSelectedValue();
    console.log('Selected Time:', `${hours}:${minutes}`, {selectedFrequency});

    onCreateTriggerNotification(
      hours,
      minutes,
      'Notification title',
      'Check the weather condition!',
      selectedFrequency,
    );
  };

  async function onCreateTriggerNotification(
    hours,
    minutes,
    title,
    body,
    frequency,
  ) {
    const triggerDate = new Date(Date.now());
    triggerDate.setHours(hours);
    triggerDate.setMinutes(minutes);

    const repeatFrequency =
      frequency === 'WEEKLY' ? RepeatFrequency.WEEKLY : RepeatFrequency.DAILY;

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: repeatFrequency,
    };

    await notifee.createTriggerNotification(
      {
        title: title,
        body: body,
        android: {
          channelId: 'default',
        },
      },
      trigger,
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Notification Settings</Text>
        <DatePicker
          style={styles.datePicker}
          mode="time"
          date={date}
          onDateChange={setDate}
        />
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedId}
          selectedId={selectedId}
          containerStyle={styles.radioGroup}
          radioButtonStyle={styles.radioButton}
          labelStyle={styles.radioButtonLabel}
        />
        <Button
          title="Set notification"
          onPress={onClickSetNotification}
          style={styles.customBtn}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30,
  },
  titleText: {
    color: 'darkblue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  datePicker: {
    marginTop: 30,
    marginBottom: 30,
  },

  customBtn: {
    marginTop: 20,
  },
  radioGroup: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#333',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SettingsPage;
