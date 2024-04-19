import { FunctionComponent, useContext } from "react";
import { ToastContext } from "../../layouts/ToastLayout";

const InfoToast: FunctionComponent<{ id: string; messageToDisplay: string }> = (
  props
) => {
  const { closeToast } = useContext(ToastContext);

  return (
    <div
      key={props.id}
      className="flex items-center w-full max-w-xs p-4 mt-2 text-gray-500 bg-blue-100 rounded-lg shadow-lg"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-200 rounded-lg">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
        <span className="sr-only">Info icon</span>
      </div>
      <div className="ml-3 mr-1 text-sm font-normal">{props.messageToDisplay}</div>
      <button
        type="button"
        className="ms-auto -mr-1.5 -my-1.5 bg-blue-100 text-blue-500 rounded-lg p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8"
        data-dismiss-target="#toast-warning"
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

export default InfoToast;
