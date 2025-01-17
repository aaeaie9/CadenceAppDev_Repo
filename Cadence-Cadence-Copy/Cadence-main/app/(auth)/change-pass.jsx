import { View, Text, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { changePassword as changeAppwritePassword, signOut } from '../../lib/appwrite'; // Renamed changePassword to avoid conflict

const ChangePass = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await signOut(); // Sign the user out
      setUser(null); // Clear user state
      setIsLoggedIn(false); // Set logged in state to false
      // Redirect to sign-in screen (you can replace this with your navigation logic)
      // Example:
      // router.replace('/sign-in')
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const [form, setForm] = useState({
    newPass: '',
    confirmPass: '',
  });

  const handleChangePassword = async () => {
    if (!form.newPass || !form.confirmPass) {
      return Alert.alert('Please fill in both fields.');
    }

    if (form.newPass !== form.confirmPass) {
      return Alert.alert('Passwords do not match.');
    }

    setLoading(true); // Show loading state

    try {
      console.log('Attempting to change password...');
      const response = await changeAppwritePassword(form.newPass); // Use the Appwrite changePassword function
      console.log('Password changed successfully', response);
      Alert.alert('Success', response); // Show success message
      logout(); // Sign the user out after password change
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', error.message); // Show error message
    } finally {
      setLoading(false); // Hide loading state
      setForm({
        newPass: '',
        confirmPass: '',
      });
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Change Password</Text>

        <FormField
          title="New Password"
          value={form.newPass}
          placeholder=""
          handleChangeText={(e) => setForm({ ...form, newPass: e })}
          otherStyles="mt-10 w-[90%] self-center"
        />

        <FormField
          title="Confirm Password"
          value={form.confirmPass}
          placeholder=""
          handleChangeText={(e) => setForm({ ...form, confirmPass: e })}
          otherStyles="mt-7 w-[90%] self-center"
        />

        <CustomButton
          title="Submit"
          handlePress={handleChangePassword} // Call the renamed function here
          containerStyles="mt-10 w-[90%] self-center"
          isLoading={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePass;
