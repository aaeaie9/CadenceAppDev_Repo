import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';

import { useGlobalContext } from '../../context/GlobalProvider'
import FormField from '../../components/FormField';
import { icons } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { uploadAudioToStorage } from '../../lib/appwrite';

const Input = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    audio: null,
  });
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Original submit function (commented out)
  /*
  const submit = async () => {
    if (!form.title || !form.audio) {
      return Alert.alert('Please fill in all the fields.');
    }

    setUploading(true);

    try {
      // Only upload the file, without transcription creation
      const fileId = await uploadAudioToStorage(form.audio); // Use your function to upload audio

      if (fileId) {
        Alert.alert('Success', 'Audio uploaded successfully.');
        router.push('/home');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
      setForm({
        title: '',
        audio: null,
      });
    }
  };
  */

  // New submit function
  const submit = async () => {
  if (!form.title || !form.audio) {
    return Alert.alert('Please fill in all the fields.');
  }

  setUploading(true);

  try {
    // Prepare the data to be uploaded
    const audioUri = form.audio.uri;
    const audioFile = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create form data for upload
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('username', user?.username )
    formData.append('audio', {
      uri: form.audio.uri,
      type: 'audio/mp3', // Or the correct MIME type for your audio file
      name: form.audio.name,
    });

    // Send the audio to the Python server
    const response = await fetch('http://192.168.254.111:5000/upload-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,  // Send the form data
    });

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', result.message);
      router.push('/home');
    } else {
      Alert.alert('Error', result.message);
    }
  } catch (error) {
    console.error('Error uploading audio:', error);
    Alert.alert('Error', 'There was an error uploading the audio.');
  } finally {
    setUploading(false);
    setForm({
      title: '',
      audio: null,
    });
  }
};

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
    });

    if (!result.canceled) {
      setForm({ ...form, audio: result.assets[0] });
    }
  };

  const togglePlayAudio = async () => {
    if (!form.audio || !form.audio.uri) {
      Alert.alert('No audio selected', 'Please select an audio file to play.');
      return;
    }

    if (isPlaying) {
      try {
        await sound.stopAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
    } else {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: form.audio.uri });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.unloadAsync();
          }
        });
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <View>
          <Text className="text-2xl text-white font-psemibold">Upload Audio</Text>

          <FormField
            title="Transcription Title"
            value={form.title}
            placeholder=""
            handleChangeText={(e) => setForm({ ...form, title: e })}
            otherStyles="mt-10 w-[90%] self-center"
          />

          <View className="mt-7 space-y-2">
            <Text className="text-gray-100 font-pmedium ml-6">Upload Audio</Text>
          </View>

          <TouchableOpacity onPress={() => openPicker('audio')}>
            {form.audio ? (
              <View className="w-[90%] h-16 rounded-xl bg-black-100 flex justify-center items-center self-center border-2 border-secondary border-dashed">
                <Text className="text-white text-sm font-pmedium">{form.audio.name}</Text>
              </View>
            ) : (
              <View className="w-[90%] h-16 px-4 bg-black-100 rounded-xl justify-center items-center self-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-6 h-6"
                />

                <Text className="text-sm text-gray-100 font-pmedium ml-2">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <CustomButton
            title={isPlaying ? 'Stop Audio' : 'Play Audio'}
            handlePress={togglePlayAudio}
            containerStyles="mt-10 w-[90%] self-center"
            isLoading={uploading}
          />

          <CustomButton
            title="Submit & Transcribe"
            handlePress={submit}
            containerStyles="mt-7 w-[90%] self-center"
            isLoading={uploading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Input;