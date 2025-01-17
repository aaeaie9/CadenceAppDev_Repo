import { View, Text, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import { images } from '../constants'
import CustomButton from './CustomButton'

const EmptyState = ({title, subtitle}) => {
  return (
    <View className='justify-center items-center px-4 mt-[70px]'>
      <Image 
        source={images.empty}
        className='w=[100px] h-[100px] ml-3'
        resizeMode='contain'
      />

      <Text className='text-xl text-center font-psemibold text-white mt-2'>
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">
        {subtitle}
      </Text>

      <CustomButton
        title="Create transcription"
        handlePress={() => router.push('/transcribe')}
        containerStyles='w-[90%] my-5 mt-[40px]'
      />
    </View>
  )
}

export default EmptyState