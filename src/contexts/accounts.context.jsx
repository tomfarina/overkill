import React, { createContext, useState } from "react";

export const AccountsContext = createContext({
  setAccounts: () => null,
  accounts: [],
});

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const value = { accounts, setAccounts };

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
};
