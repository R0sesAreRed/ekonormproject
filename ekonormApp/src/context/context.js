import React, { createContext } from "react";

export const AppContext = createContext({
  date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
  projectKey: "",
  projectName: "",
  projectType: null,
  projectWorkType: null,
  worksheetJson: [],
  permission: null,
  setProjectData: (path) => void 0,
  addRecord: (data) => void 0,
  saveLoadedWorksheet: (data) => void 0,
});
