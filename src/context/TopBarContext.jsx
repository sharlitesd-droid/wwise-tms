import { createContext, useContext, useState } from 'react';

const TopBarContext = createContext(null);

export function TopBarProvider({ children }) {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [hasLiveUpdate, setHasLiveUpdate] = useState(false);

  return (
    <TopBarContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        todayIndex,
        hasLiveUpdate,
        setHasLiveUpdate,
      }}
    >
      {children}
    </TopBarContext.Provider>
  );
}

export function useTopBar() {
  const ctx = useContext(TopBarContext);
  if (!ctx) throw new Error('useTopBar must be used within TopBarProvider');
  return ctx;
}
