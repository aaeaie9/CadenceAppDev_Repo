import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { signOut } from '../../lib/appwrite'

// Supabase logout import
import { supabase } from '../../lib/supabase'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  // Supabase logout function
  const logout = async () => {
    const { error } = await signOut();
    if (error) {
      console.log('Error logging out:', error.message);
    } else {
      setUser(null)
      setIsLoggedIn(false)
      router.replace('/sign-in')
    }
  }

  const changePass = async() => {
    router.push('/change-pass')
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='justify-center min-h-[95vh] px-4 my-6 items-center'>
          <View className='w-20 h-20 border-2 border-secondary rounded-full justify-center items-center'>
            <Image 
              source={{ uri: user?.avatar }}
              className='w-[90%] h-[90%] rounded-full'
              resizeMode='cover'
            />
          </View>
          <View>
            <Text className='text-3xl text-white font-pregular mt-2'>{user?.username}</Text>
          </View>

          <View>
            <Text className='text-xl text-white font-pregular mt-7'><Text className='text-secondary font-psemibold'>Email:</Text> {user?.email}</Text>
          </View>

          {/* <CustomButton
            title='Change Password'
            handlePress={changePass}
            containerStyles='w-[90%] my-5 mt-[40px]'
          /> */}

          <CustomButton
            title='Log out'
            handlePress={logout}
            containerStyles='w-[90%] my-5 mt-[40px]'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
