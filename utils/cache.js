import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`${key} cached`);
  } catch (error) {
    console.error(`Error caching ${key}: `, error);
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving ${key}: `, error);
  }
};
