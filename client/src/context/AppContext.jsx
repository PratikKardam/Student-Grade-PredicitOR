import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [prediction, setPrediction] = useState(null);

  return (
    <AppContext.Provider value={{ prediction, setPrediction }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
