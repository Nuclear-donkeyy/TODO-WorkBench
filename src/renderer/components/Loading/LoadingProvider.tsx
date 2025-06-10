import React, { createContext, useContext, useState } from 'react';
import { SystemLoading } from './index';

interface GlobalLoadingContextType {
  showSystemLoading: boolean;
  setShowSystemLoading: (show: boolean) => void;
}

const GlobalLoadingContext = createContext<
  GlobalLoadingContextType | undefined
>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [showSystemLoading, setShowSystemLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider
      value={{
        showSystemLoading,
        setShowSystemLoading,
      }}
    >
      {children}
      {showSystemLoading && <SystemLoading />}
    </GlobalLoadingContext.Provider>
  );
};
