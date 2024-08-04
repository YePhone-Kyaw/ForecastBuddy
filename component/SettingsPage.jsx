import React, {useMemo, useState} from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RadioGroup from 'react-native-radio-buttons-group';

// Notifee
import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

function SettingsPage() {
  const [date, setDate] = useState(new Date());

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

  const [selectedId, setSelectedId] = useState();

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

  // Notifee
  async function onCreateTriggerNotification(
    hours,
    minutes,
    title,
    body,
    frequency,
  ) {
    const date = new Date(Date.now());
    date.setHours(hours);
    date.setMinutes(minutes);

    console.log('Trigger Time:', `${hours}:${minutes}`);

    const repeatFrequency =
      frequency === 'WEEKLY' ? RepeatFrequency.WEEKLY : RepeatFrequency.DAILY;

    // Create a time-based trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: repeatFrequency,
    };

    // Create a trigger notification
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
    <View style={styles.container}>
      <Text style={styles.titleText}>Notification Settings</Text>
      <DatePicker mode="time" date={date} onDateChange={setDate} />
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setSelectedId}
        selectedId={selectedId}
      />
      <Button
        title="Set notification"
        onPress={onClickSetNotification}
        style={styles.customBtn}
      />
    </View>
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
  customBtn: {
    marginTop: 20,
  },
});

export default SettingsPage;
