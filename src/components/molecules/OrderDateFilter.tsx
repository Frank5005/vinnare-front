import React from "react";

interface OrderDateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "This Year", value: "365" },
  { label: "All", value: "all" },
];

const OrderDateFilter: React.FC<OrderDateFilterProps> = ({ value, onChange }) => (
  <select
  title="Date filter"  
  className="border rounded px-3 py-2 text-sm bg-white"
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default OrderDateFilter;