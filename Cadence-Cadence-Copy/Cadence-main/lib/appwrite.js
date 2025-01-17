import { createdAt } from 'expo-updates';
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',  // Your Appwrite endpoint
  platform: 'com.note.cadence',             // Your app's platform identifier
  projectId: '672f8fcf003e2df17426',       // Your project ID
  databaseId: '673024b00010e446d2f5',      // Your database ID
  userCollectionId: '673025150028b81688df',// Your user collection ID
  transCollectionId: '6730259200232bcd690e',
  storageId: '67302a7f00195ec2a14d'        // Your storage ID
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)  // Appwrite endpoint
  .setProject(config.projectId)  // Project ID
  .setPlatform(config.platform); // Platform ID

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Function to create a new user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error) {
    throw new Error(error)
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error;
    return currentUser.documents[0];


  } catch (error) {
    console.log(error)
  }
}

export async function changePassword(newPassword) {
  try {
    const currentUser = await account.get();
    if (!currentUser) throw new Error('User not found.');

    await account.updatePassword(newPassword);

    return 'Password changed successfully';
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error(error.message);
  }
}




export async function getFilePreview(fileId, type) {
  try {
    if (type !== 'audio') throw new Error('Invalid file type.');
    return storage.getFileView(config.storageId, fileId);
  } catch (error) {
    console.error('Error in getFilePreview:', error.message);
    throw new Error(error.message);
  }
}


export async function uploadFile(file, type) {
  if (!file) return;

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file // Pass the file directly
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }
}


export async function createTranscription(form) {
  try {
    const currentUser = await getCurrentUser();
    const audioUrl = await uploadFile(form.audio, 'audio');

    const newPost = await databases.createDocument(
      config.databaseId,
      config.transCollectionId,
      ID.unique(),
      {
        title: form.title,
        creator: currentUser?.username,
        audio: audioUrl,
        notes: [],
        createdAt: new Date().toISOString()
      }
    );

    return newPost;
  } catch (error) {
    console.error('Error creating transcription:', error);
    throw new Error(error.message);
  }
}


// test function
export async function uploadAudioToStorage(file) {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  try {
    // Upload the file to Appwrite storage
    const uploadedFile = await storage.createFile(
      config.storageId,   // Your storage bucket ID
      ID.unique(),        // Generate a unique ID for the file
      file                // The file object you want to upload
    );

    // Return the uploaded file's URL for further processing or display
    return uploadedFile.$id;
  } catch (error) {
    console.error("Error uploading audio to storage:", error);
    throw new Error(error.message);
  }
}

