import React, { useEffect, useState } from 'react';
import Home from './src/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EditView from './src/EditView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Edit" component={EditView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
