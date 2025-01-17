import { View, Text, FlatList, Image, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGlobalContext } from '../../context/GlobalProvider';
import { images } from '../../constants';
import EmptyState from '../../components/EmptyState';
import { useRouter } from 'expo-router';  
import axios from 'axios';

const Home = () => {
  const { user, loadTranscriptions, setActiveTranscription } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [renameInput, setRenameInput] = useState('');
  const router = useRouter();

  const loadTranscriptionsData = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://192.168.254.111:5000/transcriptions');
    const data = response.data;

    if (data[user?.username]) {
      setTranscriptions(data[user.username]);
      loadTranscriptions(data[user.username]);
    } else {
      setTranscriptions([]);
    }
  } catch (error) {
    console.error('Error loading transcriptions:', error);
    Alert.alert('Error', 'There was an issue loading the transcriptions.');
    setTranscriptions([]);
  } finally {
    setLoading(false);
  }
};


  const onRefresh = async () => {
    setRefreshing(true);
    await loadTranscriptionsData();
    setRefreshing(false);
  };

  const toInfo = () => {
    router.push('/info');
  };

  const goToPianoRoll = (item) => {
    setActiveTranscription(item);
    router.push('/pianoroll');
  };

  const handleDelete = async (item) => {
  try {
    await axios.delete(
      `http://192.168.254.111:5000/transcriptions/${user?.username}/${item.audio_title}`
    );
    loadTranscriptionsData(); // Reload the transcriptions after deletion
    Alert.alert('Success', 'Transcription deleted successfully');
  } catch (error) {
    console.error('Error deleting transcription:', error);
    Alert.alert('Error', 'There was an issue deleting the transcription.');
  } finally {
    setSelectedItem(null);
  }
};


  const handleRename = async (item) => {
    try {
      if (renameInput.trim()) {
        await axios.put(`http://192.168.254.111:5000/transcriptions/${item.audio_title}`, { title: renameInput });
        loadTranscriptionsData();
        Alert.alert('Success', 'Transcription renamed successfully');
      } else {
        Alert.alert('Error', 'Please enter a valid name.');
      }
    } catch (error) {
      console.error('Error renaming transcription:', error);
      Alert.alert('Error', 'There was an issue renaming the transcription.');
    } finally {
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    loadTranscriptionsData();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={transcriptions}
        keyExtractor={(item, index) => `${item.audio_title}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToPianoRoll(item)}
            onLongPress={() =>
              setSelectedItem(prev => (prev?.title === item.title ? null : item))
            }
            className="flex flex-col bg-black-100 p-4 mb-6 rounded-2xl w-[85%] self-center"
          >
            <View className="flex flex-row items-center">
              <Image
                source={images.libIcon}
                className="h-[40px] w-[40px] mr-5"
                resizeMode="contain"
              />
              <View>
                <Text className="text-white text-xl font-psemibold">{item.title}</Text>
                <View className="bg-secondary rounded-2xl pl-2 pr-2 mt-1">
                  <Text className="text-white text-sm font-pregular">{item.audio_title}</Text>
                </View>
              </View>
            </View>

            {selectedItem?.title === item.title && (
              <View className="flex flex-row justify-between items-center mt-4">
                <TouchableOpacity onPress={() => handleRename(item)}>
                  <Text className="ml-2 text-yellow-500 text-sm font-pregular">Rename</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text className="mr-2 text-red-500 text-sm font-pregular">Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Hello,</Text>
                <Text className="text-2xl font-psemibold text-secondary">
                  {user?.username || 'Guest'}
                </Text>
              </View>
              <TouchableOpacity className="mt-1.5" onPress={toInfo}>
                <Image source={images.logoSmall} resizeMode="contain" className="w-10 h-10" />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-2xl font-psemibold text-white">Your Transcriptions</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No transcriptions found."
            subtitle="Click the button below to create one!"
          />
        )}
        ListFooterComponent={() =>
          loading && (
            <View className="p-4 justify-center items-center">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <StatusBar backgroundColor="#171626" style="light" />
    </SafeAreaView>
  );
};

export default Home;
