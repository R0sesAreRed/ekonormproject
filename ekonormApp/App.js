import { View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { AppContext } from "./src/context/context";
import { useEffect, useState } from "react";
import MainPage from "./src/pages/MainPage";
import CreateProjectPage from "./src/pages/CreateProjectPage";
import DataPreview from "./src/pages/DataPreview";
import { persistWorksheet } from "./src/utils/dataStorage";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [currentDateTime, setAppData] = useState({
    date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  });
  const [worksheet, setWorksheet] = useState({ worksheetJson: [] });
  // const [projectKey, newProjectKey] = useState({ key: "" });
  // const [projectName, newProjectName] = useState({ name: "" });
  // const [projectType, newProjectType] = useState({ type: null });
  const [projectData, newProjectData] = useState({
    key: "",
    name: "",
    type: null,
    workType: null,
  });
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  useEffect(() => {
    requestPermissions();
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

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(status === "granted");
  };

  const addRecord = (data) => {
    if (projectData.key.length > 0) {
      const newJson = worksheet.worksheetJson.concat(data);
      setWorksheet({
        ...worksheet,
        worksheetJson: newJson,
      });
      persistWorksheet(projectData.key, newJson);
    }
  };
  const saveLoadedWorksheet = (data) => {
    setWorksheet({
      worksheetJson: data,
    });
  };
  // const setProjectKey = (data) => {
  //   const key = data.toString();
  //   newProjectKey({ key: key });
  // };
  // const setProjectName = (data) => {
  //   const name = data.toString();
  //   newProjectName({ name: name });
  // };

  // const setProjectType = (data) => {
  //   const type = data;
  //   newProjectType({ type: type });
  // };
  const setProjectData = (data) => {
    newProjectData({
      key: data.key,
      name: data.name,
      type: data.type,
      workType: data.workType,
    });
  };
  return (
    <AppContext.Provider
      value={{
        date: currentDateTime.date,
        worksheetJson: worksheet.worksheetJson,
        projectKey: projectData.keyKey,
        projectName: projectData.name,
        projectType: projectData.type,
        projectWorkType: projectData.workType,
        permission: hasMediaLibraryPermission,
        setProjectData,
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
          <Route path={"/DataPreview"} element={<DataPreview />} />
        </Routes>
      </NativeRouter>
    </AppContext.Provider>
  );
}
