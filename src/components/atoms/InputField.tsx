import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error,id, ...props }, ref) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm text-gray-700 font-medium text-left">{label}</label>
        <input
          ref={ref}
          id={inputId}
          type={props.type || "text"}
          {...props}
          className={`w-full border rounded px-3 py-2 text-sm 
            text-black focus:outline-none focus:ring-2 
            focus:ring-black placeholder-gray-400
            ${error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

export default InputField;
