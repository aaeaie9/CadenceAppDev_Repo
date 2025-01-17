import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href='/home' />

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className='w-full justify-center items-center min-h-[100vh] px-4'>
          <Image 
            source={images.logo}
            className='w-[180px] h-[180px]'
            resizeMode='contain'
          />

          <View className='relative mt-5'>
            <Text className='text-lg text-white font-pregular text-center mb-20'>
              Effortless Transcription for Monophonic Melodies.
            </Text>
          </View>

          <CustomButton 
            title='Continue with Email'
            handlePress={() => router.replace('/sign-in')}
            containerStyles='w-[90%] absolute self-center bottom-[50px]'
          />
        </View>
      </ScrollView> 

      <StatusBar backgroundColor='#171626' style='light'/>
    </SafeAreaView>
  )
}