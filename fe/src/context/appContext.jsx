import { createContext, useContext, useState } from 'react';
import { getAccessTokenFromLS } from '@utils/auth';
export const getInitialAppContext = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null
});
const initialAppContext = getInitialAppContext();

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children, defaultValue = initialAppContext }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultValue.isAuthenticated);

  const reset = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
