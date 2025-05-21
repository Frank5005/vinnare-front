import { useState, forwardRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error,id, ...rest }, ref) => {
    const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm text-gray-700 font-medium text-left">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            id={inputId}
            {...rest}
            className={`w-full border rounded px-3 py-2 text-sm text-black
                pr-10 focus:outline-none focus:ring-2 focus:ring-black 
                placeholder-gray-400 text-gray-700
                ${error ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            role="button"
            aria-label="Toggle password visibility"
            onClick={() => setShow(!show)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer p-3"
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

export default PasswordInput;

