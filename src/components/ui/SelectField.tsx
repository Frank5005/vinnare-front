import { forwardRef } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          ref={ref}
          {...props}
          className={`w-full border rounded px-3 py-2 text-sm text-gray-800 ${
            error ? "border-red-500" : "border-gray-300"}
            ${props.value === "" ? "text-gray-400" : "text-gray-800"}
          }`}
        >
          <option value="" disabled hidden>Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

export default SelectField;
