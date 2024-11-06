import React, { createContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

export const AppContext = React.createContext({
  date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  projectKey: "",
  projectName: "",
  worksheetJson: [],
  setProjectKey: (path) => void 0,
  setProjectName: (path) => void 0,
  addRecord: (data) => void 0,
  saveLoadedWorksheet: (data) => void 0,
});
