import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Todo } from '../typescript/interfaces';

export default function ListItem({ todo }: { todo: Todo }) {
  return (
    <View style={styles.container}>
      {todo && (
        <Text style={styles.text}>
          {' '}
          - {todo.latitude}, {todo.longitude}
        </Text>
      )}
    </View>
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
    fontSize: 20,
  },
});
