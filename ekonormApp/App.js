import { View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { AppContext } from "./src/context/context";
import { useEffect, useState } from "react";
import MainPage from "./src/pages/MainPage";
import CreateProjectPage from "./src/pages/CreateProjectPage";
import { persistWorksheet } from "./src/utils/dataStorage";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [currentDateTime, setAppData] = useState({
    date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  });
  const [worksheet, setWorksheet] = useState({ worksheetJson: [] });
  const [projectKey, newProjectKey] = useState({ key: "" });
  const [projectName, newProjectName] = useState({ name: "" });
  useEffect(() => {
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

  const addRecord = (data) => {
    if (projectKey.key.length > 0) {
      const newJson = worksheet.worksheetJson.concat(data);
      setWorksheet({
        ...worksheet,
        worksheetJson: newJson,
      });
      persistWorksheet(projectKey.key, newJson);
    }
  };
  const saveLoadedWorksheet = (data) => {
    setWorksheet({
      worksheetJson: data,
    });
  };
  const setProjectKey = (data) => {
    const key = data.toString();
    newProjectKey({ key: key });
  };
  const setProjectName = (data) => {
    const name = data.toString();
    newProjectName({ name: name });
  };
  return (
    <AppContext.Provider
      value={{
        date: currentDateTime.date,
        worksheetJson: worksheet.worksheetJson,
        projectKey: projectKey.key,
        projectName: projectName.name,
        setProjectKey,
        setProjectName,
        addRecord,
        saveLoadedWorksheet,
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
          <Route path={"/"} element={<CreateProjectPage />} />
          <Route path={"/MainPage"} element={<MainPage />} />
        </Routes>
      </NativeRouter>
    </AppContext.Provider>
  );
}
