import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../constants';
import "../../global.css";

const TabIcon = ({ icon, color, name, focused}) => {
  return (
    <View className={`items-center justify-center gap-1 mt-7`}>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className={`w-6 h-6`}
      />

      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-sm w-[100%]`} style={{color: color}}>
        {name}
      </Text>
    </View>
  )
}

const MainLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#773adb',
          tabBarInactiveTintColor: '#f1f2f4',
          tabBarStyle: {
            backgroundColor: '#171626',
            borderTopWidth: 0,
            borderTopColor: '#773adb',
            height: 64
          }
        }}
      >
        <Tabs.Screen 
          name='home'
          options={{
            title: 'Library',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name='Library'
                focused={focused}
              />
            )
          }}   
        />

        <Tabs.Screen 
          name='transcribe'
          options={{
            title: 'Transcribe',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => ( 
              <TabIcon 
                icon={icons.plus}
                color={color}
                name='Transcribe'
                focused={focused}
              />
            )
          }}   
        />

        <Tabs.Screen 
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={icons.profile}
                color={color}
                name='Profile'
                focused={focused}
              />
            )
          }}   
        />
      </Tabs>
    </>
  )
}

export default MainLayout