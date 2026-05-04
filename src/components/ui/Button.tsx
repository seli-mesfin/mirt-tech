import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  // Added "outline" to the type definition here
  variant?: "primary" | "secondary" | "outline";
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  // Use a mapping object for cleaner code as you add more styles
  const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    // Added the outline style (transparent background, teal border)
    outline: "border-2 border-teal-700 bg-transparent text-teal-700 hover:bg-teal-50"
  };

  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}