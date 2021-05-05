import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { LocationGeofencingEventType } from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { SafeAreaView, SectionList, StyleSheet, Text } from 'react-native';
import { firebase } from './firebase';
// import { SwipeListView } from 'react-native-swipe-list-view';
import ListItem from './src/ListItem';
import { Todo } from './typescript/interfaces';

interface ISectionList {
  title: string;
  data: Todo[];
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const TASK_NAME = 'GEOFENCING_TASK';

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}

export default function App() {
  let test = {};
  const [todos, setTodos] = useState<ISectionList[]>([]);
  const [hasPermission, setPermission] = useState(false);
  const [location, setLocation] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const db = firebase.firestore();
    let locations = {};
    db.collection('locations')
      .get()
      .then((locationSnapshot) => {
        locationSnapshot.forEach((doc) => {
          db.collection('locations')
            .doc(doc.id)
            .get()
            .then((querySnapshot) => {
              const data = querySnapshot.data();
              locations[doc.id] = {
                title: data.name,
                data: data.coordinates,
              };
              setTodos(Object.values(locations));
            });
        });
      });
  }, []);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('notification', notification);
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });
    schedulePushNotification();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getLocation = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      setPermission(false);
    } else {
      setPermission(true);
      console.log('start geofenc');
      await Location.startGeofencingAsync(TASK_NAME, [
        { latitude: 37.33233141, longitude: -122.0312186, radius: 1 },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        keyExtractor={(item, index) => {
          return `${item}-${index}`;
        }}
        sections={Object.values(todos)}
        renderItem={({ item }) => <ListItem todo={item} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
      />
    </SafeAreaView>
  );
}

TaskManager.defineTask(TASK_NAME, ({ data: { eventType, region }, error }: any) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (eventType === LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
  } else if (eventType === LocationGeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  header: {
    fontSize: 28,
    padding: 10,
  },
});
