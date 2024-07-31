import React, {useState} from 'react';
import {View, Button, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';

// Notifee
import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';
import {useEffect} from 'react';

function SettingsPage() {
  const [date, setDate] = useState(new Date());
  // const [hours, setHours] = useState(0);
  // const [minutes, setMinutes] = useState(0);

  const onClickSetNotification = () => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    console.log('Selected Time:', `${hours}:${minutes}`);

    onCreateTriggerNotification(hours, minutes, 'Test', 'Test body');
  };

  // Notifee
  async function onCreateTriggerNotification(hours, minutes, title, body) {
    const date = new Date(Date.now());
    date.setHours(hours);
    date.setMinutes(minutes);

    console.log('Trigger Time:', `${hours}:${minutes}`);
    // Create a time-based trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
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

  // useEffect(() => {
  //   onCreateTriggerNotification();
  // }, []);

  return (
    <View>
      <Text>Test</Text>
      <DatePicker mode="time" date={date} onDateChange={setDate} />
      <Button title="Set notification" onPress={onClickSetNotification} />
    </View>
  );
}

export default SettingsPage;
