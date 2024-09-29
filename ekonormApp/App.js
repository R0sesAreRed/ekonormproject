import { StatusBar } from "expo-status-bar";
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { AppContext, AppProvider } from "./src/context/context";
import { useEffect, useState } from "react";
import MainPage from "./src/pages/MainPage";
import * as FileSystem from "expo-file-system";
//import * as Permissions from "expo-permissions";

import {
  loadWorkseet,
  loadFilepath,
  persistFilepath,
  persistWorksheet,
} from "./src/utils/dataStorage";

export default function App() {
  const [currentDateTime, setAppData] = useState({
    date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  });
  const [worksheet, setWorksheet] = useState({ worksheetJson: [] });
  const [filepath, setFilePath] = useState(null);

  useEffect(() => {
    //requestExternalStoragePermission();

    const interval = setInterval(() => {
      const newDate = new Date();
      setAppData({
        date: {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDate(),
          hour: newDate.getHours(),
          minute: newDate.getMinutes(),
        },
      });
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);
  // const requestExternalStoragePermission = async () => {
  //   if (Platform.OS === "android") {
  //     try {
  //       if (Platform.Version >= 29) {
  //         const status = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE,
  //           {
  //             title: "Aplikacja wymaga pozwoleń",
  //             message:
  //               "Aplikacja wymaga pozwoleń na zapis" +
  //               "i odczyt danych z urządzenia",
  //             buttonNeutral: "Spytaj mnie później",
  //             buttonNegative: "Anuluj",
  //             buttonPositive: "OK",
  //           }
  //         );
  //       } else {
  //         const writeStatus = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  //           {
  //             title: "Aplikacja wymaga pozwoleń",
  //             message:
  //               "Aplikacja wymaga pozwoleń na " + "zapis danych z urządzenia",
  //             buttonNeutral: "Spytaj mnie później",
  //             buttonNegative: "Anuluj",
  //             buttonPositive: "OK",
  //           }
  //         );
  //         const readStatus = await request(
  //           PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  //           {
  //             title: "Aplikacja wymaga pozwoleń",
  //             message:
  //               "Aplikacja wymaga pozwoleń na " + "odczyt danych z urządzenia",
  //             buttonNeutral: "Spytaj mnie później",
  //             buttonNegative: "Anuluj",
  //             buttonPositive: "OK",
  //           }
  //         );
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // };
  const newWorksheet = () => {};
  const newfilePath = () => {};
  const addRecord = (data) => {
    const newJson = worksheet.worksheetJson.concat(data);
    setWorksheet({
      ...worksheet,
      worksheetJson: newJson,
    });
    persistWorksheet(newJson);
  };
  return (
    <AppContext.Provider
      value={{
        date: currentDateTime.date,
        worksheetJson: worksheet.worksheetJson,
        filepath,
        newWorksheet,
        newfilePath,
        addRecord,
      }}
    >
      <NativeRouter>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 100,
          }}
        ></View>

        <Routes>
          <Route path={"/"} element={<MainPage />} />
        </Routes>
      </NativeRouter>
    </AppContext.Provider>
  );
}
