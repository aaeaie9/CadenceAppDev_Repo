import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'

const Info = () => {

  return (
    <SafeAreaView className='bg-primary h-full w-full'>
      <ScrollView className="px-4 my-6">
        <View className='w-[90%] self-center'>
          <Image
            source={images.logoSmall}
            resizeMode='contain'
            className='w-[100px] h-[100px] self-center mb-5'
          />

          <Text className='text-white text-2xl font-psemibold'><Text className='text-secondary'>Cadence</Text> Application Guide</Text>
          <Text className='text-white font-pregular text-m mt-4'>Welcome to Cadence, your portable solution for monophonic music transcription! This guide will help you understand and navigate the app, so you can make the most out of its features.</Text>

          <View className="bg-gray-500 h-0.5 w-full my-4" />

          <Text className='text-white text-2xl font-psemibold mt-3'>Getting Started</Text>
          <Text className='text-white font-pregular text-m mt-4'><Text className='text-secondary font-psemibold'>Sign Up or Log In:</Text> Create an account to access all features. You’ll need to provide basic details.</Text>

          <View className="bg-gray-500 h-0.5 w-full my-4" />

          <Text className='text-white text-2xl font-psemibold mt-3'>Main Feature</Text>
          <Text className='text-secondary font-psemibold mt-3'>Record Audio</Text>
          <Text className='text-white font-pregular'>○ Tap the <Text className='text-secondary'>Record</Text> button on the home screen.</Text>
          <Text className='text-white font-pregular'>○ Start playing or singing your monophonic melody.</Text>
          <Text className='text-white font-pregular'>○ Press <Text className='text-secondary'>Stop</Text> when you’re done.</Text>
          <Text className='text-white font-pregular'>○ Ensure a quiet environment to improve transcription accuracy.</Text>
          <Text className='text-white font-pregular'>○ The app only supports monophonic melodies. The transcription might be inaccurate if the audio is polyphonic.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Upload Audio</Text>
          <Text className='text-white font-pregular'>○ Tap <Text className='text-secondary'>Choose a file</Text> button.</Text>
          <Text className='text-white font-pregular'>○ Choose an audio file from your device and submit.</Text>
          <Text className='text-white font-pregular'>○ You can also play the uploaded audio to check if it’s the right one.</Text>
          <Text className='text-white font-pregular'>○ Use files with clear, single-melody tracks for best results.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Transcribe Audio</Text>
          <Text className='text-white font-pregular'>○ Once recorded or uploaded, tap <Text className='text-secondary'>Submit & Transcribe</Text> to process the audio.</Text>
          <Text className='text-white font-pregular'>○ The app will detect pitch and display it for visualization.</Text>
          <Text className='text-white font-pregular'>○ Use files with clear, single-melody tracks for best results.</Text>

          <Text className='text-secondary font-psemibold mt-3'>View Transcription</Text>
          <Text className='text-white font-pregular'>○ Access the piano roll interface to see the visual representation of your transcription.</Text>
          <Text className='text-white font-pregular'>○ Use this to analyze or edit the notes before exporting.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Transcription Library</Text>
          <Text className='text-white font-pregular'>○ Access your saved transcriptions from the <Text className='text-secondary'>Library</Text> tab.</Text>
          <Text className='text-white font-pregular'>○ Select a transcription to view, edit, or export it again.</Text>
          <Text className='text-white font-pregular'>○ Use the library to organize and manage your transcriptions easily.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Profile</Text>
          <Text className='text-white font-pregular'>○ Tap the <Text className='text-secondary'>Profile</Text> tab to view your profile.</Text>
          <Text className='text-white font-pregular'>○ Tap <Text className='text-secondary'>Log Out</Text> to securely exit your account.</Text>

          <View className="bg-gray-500 h-0.5 w-full my-4" />

          <Text className='text-white text-2xl font-psemibold mt-3'>FAQs</Text>
          <Text className='text-secondary font-psemibold mt-3'>What is monophonic audio?</Text>
          <Text className='text-white font-pregular'>○ It refers to a single melody line without harmony or accompaniment.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Why is transcription limited to monophonic audio?</Text>
          <Text className='text-white font-pregular'>○ This ensures accuracy and simplifies processing for quick results.</Text>

          <Text className='text-secondary font-psemibold mt-3'>Do I need an internet connection?</Text>
          <Text className='text-white font-pregular'>○ Yes, an internet connection is required for transcription processing.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  
  )
  
}

export default Info