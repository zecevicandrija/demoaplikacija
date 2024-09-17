// firebaseStorage.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseconfig';

const uploadImageToStorage = async (imageFile) => {
  try {
    // Kreiranje referenci na Storage
    const storageRef = ref(storage, `images/${imageFile}`);

    // Prenos slike
    const snapshot = await uploadBytes(storageRef, imageFile);

    // Dobijanje URL-a slike
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Greška pri prenosu slike:', error);
    throw error;
  }
};

export default uploadImageToStorage;
