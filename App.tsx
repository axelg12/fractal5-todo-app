import React from 'react';
import { SafeAreaView, ScrollView, SectionList, StyleSheet, Text } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import ListItem from './src/ListItem';

const todo = [
  { title: 'Location', data: [{ title: 'Test', location: { lat: 123, lng: 321 } }] },
  {
    title: 'Location 2',
    data: [
      { title: 'Test 2', location: { lat: 123, lng: 321 } },
      { title: 'Test 2', location: { lat: 123, lng: 321 } },
      { title: 'Test 2', location: { lat: 123, lng: 321 } },
    ],
  },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={todo}
        renderItem={({ item }) => <ListItem todo={item} />}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.header}>{title}</Text>}
      />
    </SafeAreaView>
  );
}

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
