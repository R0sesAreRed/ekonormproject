import React from "react";

export const AppContext = React.createContext({
  date: { year: 1990, month: 0, day: 0, hour: 12, minute: 0 },
});
