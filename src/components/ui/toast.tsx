import React, { createContext, useContext, useRef } from 'react';

import { Toast, ToastMessage } from 'primereact/toast';

type SimpleToast = (summary: string, detail: string) => void;

interface ToastContextType {
  toast: {
    success: SimpleToast;
    info: SimpleToast;
    warn: SimpleToast;
    error: SimpleToast;
    detailed: (message: ToastMessage) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastProvider = ({ children }: { children: React.ReactNode}) => {
  const toastRef = useRef<Toast>(null);

  const simpleToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, detail });
    }
  }

  const successToast = (summary: string, detail: string) => {
    simpleToast('success', summary, detail);
  }

  const infoToast = (summary: string, detail: string) => {
    simpleToast('info', summary, detail);
  }

  const warnToast = (summary: string, detail: string) => {
    simpleToast('warn', summary, detail);
  }

  const errorToast = (summary: string, detail: string) => {
    simpleToast('error', summary, detail);
  }

  const detailedToast = (message: ToastMessage) => {
    if (toastRef.current) {
      toastRef.current.show(message);
    }
  }

  return (
    <ToastContext.Provider
      value={{ 
        toast: {
          success: successToast,
          info: infoToast,
          warn: warnToast,
          error: errorToast,
          detailed: detailedToast,
        },
      }}
    >
      {children}

      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export { ToastProvider, useToast };
