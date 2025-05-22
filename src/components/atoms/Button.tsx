import { cn } from "../../utils/cn";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

const Button = ({ variant = "primary", children, className, ...props }: ButtonProps) => {
  const baseStyles = "w-full py-2 rounded font-semibold transition-colors";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-900",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-black text-black hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      className={cn(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;
