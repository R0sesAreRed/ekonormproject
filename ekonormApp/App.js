import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { AppContext } from "./src/context/context";
import { useEffect, useState } from "react";
import MainPage from "./src/pages/MainPage";

export default function App() {
  const [currentDateTime, setAppData] = useState({
    date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      setAppData({
        ...currentDateTime,
        //currentData: res ? JSON.parse(res) : [],
        date: {
          year: newDate.getFullYear(),
          month: newDate.getMonth(),
          day: newDate.getDay(),
          hour: newDate.getHours(),
          minute: newDate.getMinutes(),
        },
      });
    }, 1000); // Update every second

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ date: currentDateTime.date }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
