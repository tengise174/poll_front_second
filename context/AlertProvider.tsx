"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import CustomAlert from "@/components/CustomAlert";

type AlertContextType = {
  showAlert: (
    message: string,
    type?: "success" | "info" | "warning" | "error" | undefined,
    className?: string,
    closable?: boolean
  ) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "info" | "warning" | "error" | undefined;
    className: string;
    icon: React.ReactNode;
    closable: boolean;
  } | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "info" | "warning" | "error" | undefined = "success",
    className: string = "",
    icon: React.ReactNode,
    closable: boolean = false
  ) => {
    setAlert({ message, type, className, icon, closable });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 mt-6">
          <CustomAlert
            message={alert.message}
            type={alert.type}
            className={alert.className}
            onClose={() => setAlert(null)}
            closable={alert.closable}
            duration={5}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
