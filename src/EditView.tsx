import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { addNewLocation, deleteLocation, updateLocation } from '../api/FirebaseApi';

export default function EditView({ route, navigation }: { route?: any; navigation: any }) {
  const [description, setDescription] = useState(route.params?.todo?.description || '');
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const onSave = () => {
    if (route.params?.todo?.id) {
      updateLocation(
        { description, location: selectedLocationId !== '' ? selectedLocationId : null },
        route.params.todo.id
      );
    } else {
      addNewLocation({
        description,
        location: selectedLocationId !== '' ? selectedLocationId : null,
      });
    }
    navigation.navigate('Home');
  };

  const onDelete = () => {
    if (route.params?.todo.id) {
      deleteLocation(route.params.todo.id);
    }
    navigation.navigate('Home');
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        label="Description*"
        style={styles.input}
        onChangeText={setDescription}
        value={description}
      />
      <Picker
        selectedValue={selectedLocationId}
        onValueChange={(itemValue, itemIndex) => setSelectedLocationId(itemValue)}
      >
        <Picker.Item label={'No location'} value={''} />

        {route.params?.location.map((location) => (
          <Picker.Item key={location.id} label={location.name} value={location.id} />
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </Button>
        <Button mode="outlined" style={styles.button} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </Button>
        <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  input: {
    margin: 20,
  },
  buttonContainer: {
    margin: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    width: 100,
    backgroundColor: '#4ddc9f',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
  },
});
