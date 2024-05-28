import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";

export const CurrentSearchGlobalDataContext = createContext("");
export const CurrentSearchGlobalDispatchContext = createContext(null);

export function useCurrentSearchGlobalData() {
  return useContext(CurrentSearchGlobalDataContext);
}

export function useCurrentSearchGlobalDispatch() {
  return useContext(CurrentSearchGlobalDispatchContext);
}

export function CurrentSearchProvider({ children }) {
  // Initialize useLocalStorage with a key and an initial value
  let [currentSearchLocalStorage, setCurrentSearchLocalStorage] =
    useLocalStorage("currentSearch", []);

  let [currentSearch, setCurrentSearch] = useState(currentSearchLocalStorage);

  useEffect(() => {
    // When currentSearch updates, write the new value to localStorage
    setCurrentSearchLocalStorage(currentSearch);
  }, [currentSearch, setCurrentSearchLocalStorage]);

  return (
    <CurrentSearchGlobalDataContext.Provider value={currentSearch}>
      <CurrentSearchGlobalDispatchContext.Provider value={setCurrentSearch}>
        {children}
      </CurrentSearchGlobalDispatchContext.Provider>
    </CurrentSearchGlobalDataContext.Provider>
  );
}
