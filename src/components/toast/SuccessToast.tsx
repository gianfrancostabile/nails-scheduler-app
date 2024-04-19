import { FunctionComponent, useContext } from "react";
import { ToastContext } from "../../layouts/ToastLayout";

const SuccessToast: FunctionComponent<{
  id: string;
  messageToDisplay: string;
}> = (props) => {
  const { closeToast } = useContext(ToastContext);

  return (
    <div
      key={props.id}
      className="flex items-center w-full max-w-xs p-4 mt-2 text-gray-500 bg-green-100 rounded-lg shadow"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-200 rounded-lg">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <span className="sr-only">Check icon</span>
      </div>
      <div className="ml-3 mr-1 text-sm font-normal">{props.messageToDisplay}</div>
      <button
        type="button"
        className="ms-auto -mr-1.5 -my-1.5 bg-green-100 rounded-lg p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#toast-success"
        aria-label="Close"
        onClick={() => closeToast(props.id)}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default SuccessToast;
