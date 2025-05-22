import React from 'react';

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { label: "Alphabetical (A-Z)", value: "az" },
  { label: "Alphabetical (Z-A)", value: "za" },
  { label: "Price (Low to High)", value: "priceAsc" },
  { label: "Price (High to Low)", value: "priceDesc" },
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col text-sm text-gray-700">
      <label className="mb-1 font-medium">Sort By</label>
      <select
        aria-label="Sort By"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
