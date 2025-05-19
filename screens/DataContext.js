import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [datosGuardados, setDatosGuardados] = useState([]); // 🔥 Estado global

  return (
    <DataContext.Provider value={{ datosGuardados, setDatosGuardados }}>
      {children}
    </DataContext.Provider>
  );
};
