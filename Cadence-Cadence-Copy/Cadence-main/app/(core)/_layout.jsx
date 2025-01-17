import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import "../../global.css";

const CoreLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name='pianoroll'
          options={{
            headerShown: false,  // Hide the header for this screen
          }}
        />
      </Stack>

      <StatusBar backgroundColor='#171626' style='light'/>
    </>
  );
}

export default CoreLayout;
