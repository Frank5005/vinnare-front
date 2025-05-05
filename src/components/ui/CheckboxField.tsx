import { forwardRef } from "react";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-sm text-gray-700 relative">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="peer h-4 w-4 appearance-none border border-gray-400 rounded-sm 
              checked:bg-black checked:border-black focus:ring-0"
              {...props}
            />
            {/* Chulito */}
            <svg
              className="absolute top-0 left-0 w-4 h-4 text-white hidden peer-checked:block pointer-events-none"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {label}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

export default CheckboxField;
