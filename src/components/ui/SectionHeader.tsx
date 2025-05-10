import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
}) => (
  <div className="flex flex-col items-center text-center gap-4 py-8">
    <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
    {description && (
      <p className="text-gray-500 max-w-xl">{description}</p>
    )}
    {buttonText && (
      <button
        onClick={onButtonClick}
        className="border border-black bg-transparent px-6 py-2 rounded-md font-semibold hover:bg-gray-200 hover:text-black transition"
      >
        {buttonText}
      </button>
    )}
  </div>
);

export default SectionHeader;