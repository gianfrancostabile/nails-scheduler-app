import { FunctionComponent, createContext, useState } from "react";
import { v4 as generateUUID } from "uuid";
import ToastBuilder, { ToastData } from "../components/toast/ToastBuilder";

interface ToastPropsContext {
  registerToast: Function;
  closeToast: Function;
}

const initialPropsContext: ToastPropsContext = {
  registerToast: (toast: ToastData) => {},
  closeToast: (id: string) => {},
};

export const ToastContext = createContext(initialPropsContext);

const ToastLayout: FunctionComponent<{ children: any }> = (props) => {
  const [toastList, setToastList] = useState([] as ToastData[]);

  const registerToast = (newToast: ToastData) => {
    if (newToast) {
      newToast.id = generateUUID();
      setToastList((previousValue) => [...previousValue, newToast]);
      setTimeout(() => closeToast(newToast.id), 10000);
    }
  };

  const closeToast = (id: string) => {
    if (id) {
      setToastList((previousValue) => [
        ...previousValue.filter((toast) => toast.id !== id),
      ]);
    }
  };

  return (
    <ToastContext.Provider value={{ registerToast, closeToast }}>
      {props.children}
      <div className="absolute bottom-0 right-0 px-7 py-5 z-50">
        {toastList.map((toast) => (
          <ToastBuilder data={{ ...toast }} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastLayout;
