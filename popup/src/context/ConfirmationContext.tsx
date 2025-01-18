import React, { createContext, ReactNode, useState, useContext } from "react";

interface ConfirmationData {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmationContextType {
  showConfirmation: (data: ConfirmationData) => void;
  hideConfirmation: () => void;
  confirmationData: ConfirmationData | null;
  isVisible: boolean;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(
  undefined
);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error(
      "useConfirmation must be used within a ConfirmationProvider"
    );
  }
  return context;
};

interface ConfirmationProviderProps {
  children: ReactNode;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({
  children,
}) => {
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showConfirmation = (data: ConfirmationData) => {
    setConfirmationData(data);
    setIsVisible(true);
  };

  const hideConfirmation = () => {
    setIsVisible(false);
    setConfirmationData(null);
  };

  return (
    <ConfirmationContext.Provider
      value={{
        showConfirmation,
        hideConfirmation,
        confirmationData,
        isVisible,
      }}
    >
      {children}
    </ConfirmationContext.Provider>
  );
};
