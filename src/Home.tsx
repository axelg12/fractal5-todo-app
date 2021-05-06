import React, { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { LocationGeofencingEventType } from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  RefreshControl,
} from 'react-native';
import ListItem from './ListItem';
import { getLocations, getTodos } from '../api/FirebaseApi';
import { registerForPushNotificationsAsync, schedulePushNotification } from '../api/Notifications';
import { ILocation } from '../typescript/interfaces';

const GEO_FENCING = 'GEOFENCING_TASK';

export default function Home({ navigation }: any) {
  const [todos, setTodos] = useState<ISectionList[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [locations, setLocations] = useState<ILocation[]>([]);

  useEffect(() => {
    getLocationsAndTodos();
  }, []);

  const getLocationsAndTodos = async () => {
    getLocations().then((dbLocations) => {
      setLocations(dbLocations);
    });
    getTodos().then((dbTodos) => {
      setTodos(dbTodos);
    });
  };
  const [hasPermission, setPermission] = useState(false);
  const [sectionList, setSectionList] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register geofencing and location services
    getLocation();

    // Notification setup taken from Expo
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('response', response);
    });
    // For testing purposes
    schedulePushNotification('Dont forget this!');

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    constructSectionList();
  }, [locations, todos]);

  const constructSectionList = () => {
    const todosWithLocations = locations
      .map((location) => {
        return {
          title: location.name,
          data: todos
            .filter((todo) => todo.locationID === location.id)
            .map((todo) => {
              return { ...todo, ...{ coordinates: location.coordinates } };
            }),
        };
      })
      // filter out locations with no reminders
      .filter((location) => location.data.length > 0);
    const nonLocationReminders = todos.filter((todo) => !todo.locationID);
    const nonLocationRemindersObject = { title: 'No location', data: nonLocationReminders };
    setSectionList([...todosWithLocations, nonLocationRemindersObject]);
  };

  const getLocation = async () => {
    /**
     * In order to request background permission we must also ask for the foreground location
     * permission. First the foreground permission is granted and then the background one.
     */
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted' || foregroundStatus !== 'granted') {
      setPermission(false);
    } else {
      setPermission(true);
      const geoFences = locations
        .filter((location) => location.coordinates)
        .map((location) => {
          return {
            latitude: location.coordinates?.latitude,
            longitude: location.coordinates?.longitude,
            // geofencing of 500 meters
            radius: 500,
          };
        });
      // register geofencing
      await Location.startGeofencingAsync(GEO_FENCING, geoFences);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getLocationsAndTodos();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item, index) => {
          return `${item}-${index}`;
        }}
        sections={sectionList}
        renderItem={({ item }) => (
          <ListItem todo={item} navigation={navigation} location={locations} />
        )}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
      />
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          activeOpacity={0.2}
          style={styles.button}
          onPress={() => {
            navigation.navigate('Edit', { location: locations });
          }}
          underlayColor="#4DDC9F"
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

// Geofencing task. This must be defined top level.
// Part of code taken from the Expo site
TaskManager.defineTask(GEO_FENCING, ({ data: { eventType, region }, error }: any) => {
  if (error) {
    return;
  }

  // send notification to the user that he has entered a location with a reminder
  if (eventType === LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
    // TODO: look up the todo list description based on the location coordinates
    schedulePushNotification('Dont forget this!');
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
    fontSize: 18,
    padding: 10,
  },
  button: {
    backgroundColor: '#4DDC9F',
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 30,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
