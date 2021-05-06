import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Todo } from '../typescript/interfaces';

export default function ListItem({
  todo,
  navigation,
  location,
}: {
  todo: any;
  navigation: any;
  location: any;
}) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate('Edit', { todo, location });
      }}
    >
      {todo && <Text style={styles.text}>{todo.description}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginRight: 20,
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 20,
    flexDirection: 'row',
    /* Generated with box shawdow generator */
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  text: {
    fontSize: 16,
  },
});
