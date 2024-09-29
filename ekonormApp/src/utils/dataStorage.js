import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.removeItem(key);
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {}
};

export function persistWorksheet(curr) {
  storeData("WORKSHEET", curr);
}

export function loadWorkseet() {
  return getData("WORKSHEET");
}

export function persistFilepath(curr) {
  storeData("FILEPATH", curr);
}

export function loadFilepath() {
  return getData("FILEPATH");
}
