import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.removeItem(key);
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};
const deletedata = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
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

export function persistWorksheet(key, curr) {
  storeData("WSHT_" + key, JSON.stringify(curr));
}

export function loadWorksheet(key) {
  return getData("WSHT_" + key);
}

export function addProject(curr) {
  storeData("PROJECTS", JSON.stringify(curr));
}

export function getProjects() {
  return getData("PROJECTS");
}

export function deleteData(key) {
  return deletedata(key);
}

const logAllAsyncStorageData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    const allData = await AsyncStorage.multiGet(allKeys);

    allData.forEach(([key, value]) => {
      console.debug(`Key: ${key}, Value: ${value}`);
    });
  } catch (error) {
    console.error("Error fetching AsyncStorage data:", error);
  }
};

export function seeAll() {
  return logAllAsyncStorageData();
}
