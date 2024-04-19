import { FunctionComponent } from "react";
import ErrorToast from "./ErrorToast";
import InfoToast from "./InfoToast";
import SuccessToast from "./SuccessToast";

export enum ToastType {
  INFO,
  SUCCESS,
  ERROR,
}

export interface ToastData {
  id: string;
  text: string;
  type: ToastType;
}

const ToastBuilder: FunctionComponent<{ data: ToastData }> = (props) => {
  const buildToast = () => {
    switch (props.data.type) {
      case ToastType.INFO:
        return (
          <InfoToast id={props.data.id} messageToDisplay={props.data.text} />
        );
      case ToastType.SUCCESS:
        return (
          <SuccessToast id={props.data.id} messageToDisplay={props.data.text} />
        );
      case ToastType.ERROR:
        return (
          <ErrorToast id={props.data.id} messageToDisplay={props.data.text} />
        );
    }
  };

  return <>{buildToast()}</>;
};

export default ToastBuilder;
