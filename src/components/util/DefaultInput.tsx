import { ChangeEvent, FunctionComponent } from "react";

const DefaultInput: FunctionComponent<{
  id: string;
  type: string;
  fieldName: string;
  placeholder?: string;
  fieldValue: any;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
  autofocus?: boolean;
  maxLength?: number;
  isFirst?: boolean;
  isLast?: boolean;
}> = (props) => {
  return (
    <label
      htmlFor={props.id}
      className={"flex flex-col bg-white border border-gray-300 text-gray-900 text-sm p-2.5 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500" + (props.isFirst ? " rounded-tl-lg rounded-tr-lg" : " border-t-0")  + (props.isLast ? " rounded-bl-lg rounded-br-lg" : "")}
    >
      <span>{props.fieldName}</span>
      <input
        id={props.id}
        name={props.id}
        type={props.type}
        className="outline-none"
        placeholder={props.placeholder || ""}
        value={props.fieldValue}
        autoFocus={props.autofocus}
        maxLength={props.maxLength}
        onChange={props.onChange}
      />
    </label>
  );
};

export default DefaultInput;
