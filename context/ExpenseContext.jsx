import React, { createContext, useState } from "react";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [split, setSplit] = useState({});

  return (
    <ExpenseContext.Provider
      value={{
        split,
        setSplit,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
